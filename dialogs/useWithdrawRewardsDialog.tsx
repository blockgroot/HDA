import Link from "@atoms/Link/Link";
import Typography from "@atoms/Typography/Typography";
import { SP_PORTFOLIO_HOLDING } from "@constants/queriesKey";
import { defaultLiquidStakingState } from "@constants/sp-portfolio";
import { useAppContext } from "@libs/appContext";
import { Modal } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { LiquidNativeTokenRedirectionInfo } from "@molecules/LiquidNativeTokenRedirectionInfo/LiquidNativeTokenRedirectionInfo";
import { RedirectToLiquidNativeTokenTable } from "@molecules/RedirectToLiquidNativeTokenTable/RedirectToLiquidNativeTokenTable";
import { WithdrawFundTable } from "@molecules/WithdrawFundsTable/WithdrawFundsTable";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { useDialog } from "@terra-dev/use-dialog";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import { useWallet } from "@terra-money/wallet-provider";
import { LiquidStakingState } from "@types_/liquid-staking-pool";
import { config } from "config/config";
import { getAnalytics, logEvent } from "firebase/analytics";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import Loader from "../components/common/Loader";
import SDButton from "../components/common/SDButton";
import SuccessAnimation from "../components/common/SuccessAnimation";
import {
  REDIRECT_TO_LIQUID_NATIVE_TOKEN,
  ustFee,
  ustConvertToLiquidNativeToken,
  WITHDRAW_FUNDS,
  LINK_LIQUID_NATIVE_TOKEN_OVER_NATIVE_TOKEN, LIQUID_NATIVE_TOKEN_LABEL, NATIVE_TOKEN_LABEL
} from "../constants/constants";
import { nativeTokenFormatter } from "../utils/CurrencyHelper";
import { toUserReadableError } from "../utils/ErrorHelper";
import { firebase } from "../utils/firebase";

export function useWithdrawRewardsDialog() {
  return useDialog(WithdrawRewardsDialog);
}

interface Props {
  closeDialog?: any;
  title: string;
  sccContractAddress: any;
  undelegationRecordInfo: any;
}

function WithdrawRewardsDialog({
  sccContractAddress,
  title,
  closeDialog,
  undelegationRecordInfo,
}: Props) {
  const wallet = useWallet();
  const { terra, ustBalance, walletAddress, updateWalletBalance } =
    useAppContext();
  const queryClient = useQueryClient();
  let firebaseApp = firebase;

  const [errMsg, setErrMsg] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [liquidStakingState, setLiquidStakingState] =
    useState<LiquidStakingState>(defaultLiquidStakingState);

  function setErrorMsgForFailure(
    errorMessage = "Something did not go right. Please try again!",
    timeout = 5000
  ) {
    setErrMsg(errorMessage);
    setTimeout(() => {
      setErrMsg("");
    }, timeout);
  }

  useEffect(() => {
    const fetchState = async () => {
      const state: { state: LiquidStakingState } =
        await terra.wasm.contractQuery(config.contractAddresses.liquidStaking, {
          state: {},
        });
      return state.state;
    };
    fetchState().then((state) => {
      setLiquidStakingState(state);
    });
  }, []);

  const getLiquidNativeTokenMinted = (): number => {
    return (
      getUndelegationAmount() / parseFloat(liquidStakingState.exchange_rate)
    );
  };

  const getUndelegationAmount = (): number => {
    let shares = parseFloat(undelegationRecordInfo.shares);
    let unbondingSlashingRatio = parseFloat(
      undelegationRecordInfo.undelegationInfo.unbonding_slashing_ratio
    );
    let undelegationRatio = parseFloat(
      undelegationRecordInfo.undelegationInfo.undelegation_s_t_ratio
    );

    return (shares / undelegationRatio) * unbondingSlashingRatio;
  };

  const logFirebaseEvent = (eventName: string) => {
    const analytics = getAnalytics();
    logEvent(analytics, eventName);
  };

  const withdrawFunds = async (redirectToLiquidNativeToken: boolean) => {
    if (walletAddress && walletAddress !== "") {
      setSpinner(true);
      let msgs = [];
      msgs.push(
        new MsgExecuteContract(walletAddress, sccContractAddress.addr, {
          withdraw_rewards: {
            undelegation_id: undelegationRecordInfo.id,
            strategy_id: undelegationRecordInfo.strategy_id,
          },
        })
      );

      if (redirectToLiquidNativeToken) {
        msgs.push(
          new MsgExecuteContract(
            walletAddress,
            config.contractAddresses.liquidStaking,
            {
              deposit: {},
            },
            { uNativeToken: Math.floor(getUndelegationAmount()) }
          )
        );
      }
      try {
        const fee = await terra.tx.estimateFee(walletAddress, msgs);

        // Create and sign transaction
        let ustWalletBalance = ustBalance;
        if (ustWalletBalance < ustFee || !ustWalletBalance) {
          throw Error("InsufficientUST");
        } else {
          const txfee = redirectToLiquidNativeToken ? ustConvertToLiquidNativeToken : ustFee;
          const tx = await wallet.post({
            msgs,
            fee: new StdFee(fee.gas, `${(txfee * 1000000).toFixed()}uusd`),
            memo: `${redirectToLiquidNativeToken ? REDIRECT_TO_LIQUID_NATIVE_TOKEN : WITHDRAW_FUNDS}`,
          });

          if (!(!!tx.result && !!tx.result.txhash)) {
            throw Error("Failed to send transaction");
          } else {
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(updateWalletBalance());
              }, 4000);
            });
            await new Promise((resolve) => {
              setTimeout(async () => {
                resolve(
                  await queryClient.refetchQueries([
                    SP_PORTFOLIO_HOLDING,
                    walletAddress,
                  ])
                );
              }, 1000);
            });
            if (redirectToLiquidNativeToken) {
              setSuccessMessage(`${nativeTokenFormatter(
                getUndelegationAmount()
              )} ${NATIVE_TOKEN_LABEL} has been exchanged for
              ${nativeTokenFormatter(getLiquidNativeTokenMinted())} ${LIQUID_NATIVE_TOKEN_LABEL}!`);
            } else {
              setSuccessMessage("Your funds have been withdrawn!");
            }

            setSuccess(true);
            logFirebaseEvent("claimed_undelegated_rewards");
          }

          setSpinner(false);
        }
      } catch (err: any) {
        setErrorMsgForFailure(toUserReadableError(err.toString()));
        setSpinner(false);
      }
    }
  };

  const closeAndRefresh = () => {
    setSuccess(false);
    closeDialog();
  };

  return (
    <Modal open onClose={() => closeDialog()} className="dialog">
      <Dialog className="dialog-container" onClose={() => closeDialog()}>
        <div className="w-full">
          {spinner && !success ? (
            <div className="loader-container">
              <Loader classes={"loaderContainer"} />
              <p className="loader-text-message">
                Your transaction is in progress...
              </p>
            </div>
          ) : !spinner && success ? (
            <div className="success-container">
              <div className="success-icon">
                <SuccessAnimation />
              </div>

              <p className="message">{successMessage}</p>
              <SDButton
                className="success-button"
                text="OK"
                onClick={() => closeAndRefresh()}
              />
            </div>
          ) : (
            <div>
              <p className="dialogHeader">Withdraw Rewards</p>
              <p className="title m-0">{title}</p>
              <div className="contract-details">
                <div>
                  <p className="amount-display">
                    {nativeTokenFormatter(getUndelegationAmount())}{" "}
                    <span className="amount-currency">{NATIVE_TOKEN_LABEL}</span>
                  </p>
                </div>
                <div className="charge">
                  <p className="m-0 chargeHeader">Transaction Fee: </p>
                  <div className="chargeText">
                    <p className="m-0">{ustFee} </p>
                    <p className="mb-0 ms-1"> {"UST"}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <LiquidNativeTokenRedirectionInfo />
              </div>
              <Typography fontWeight="bold" variant="body3" className="mt-3">
                Select an option
              </Typography>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <WithdrawFundTable
                  withdrawFundsAction={withdrawFunds}
                  isWithdrawFundsDialog={false}
                />
                <RedirectToLiquidNativeTokenTable
                  withdrawFundsAction={withdrawFunds}
                  isWithdrawFundsDialog={false}
                />
              </div>
              <Link
                href={LINK_LIQUID_NATIVE_TOKEN_OVER_NATIVE_TOKEN}
                variant={"gradient"}
                className="mt-10 place-content-center"
                target={"_blank"}
              >
                Why is {LIQUID_NATIVE_TOKEN_LABEL} better than ${NATIVE_TOKEN_LABEL}?
              </Link>
              {errMsg && errMsg !== "" && (
                <div className="error-message">
                  <CancelOutlinedIcon fontSize="small" className="errorIcon" />
                  <span>{errMsg}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}
