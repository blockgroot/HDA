import Link from "@atoms/Link/Link";
import Typography from "@atoms/Typography/Typography";
import { SP_PORTFOLIO_HOLDING } from "@constants/queriesKey";
import { defaultLiquidStakingState } from "@constants/sp-portfolio";
import { useAppContext } from "@libs/appContext";
import { Modal } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { LunaXRedirectionInfo } from "@molecules/LunaXRedirectionInfo/LunaXRedirectionInfo";
import { RedirectToLunaXTable } from "@molecules/RedirectToLunaXTable/RedirectToLunaXTable";
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
  REDIRECT_TO_LUNAX,
  ustFee,
  ustConvertToLunaX,
  WITHDRAW_FUNDS,
  LINK_LUNAX_OVER_LUNA,
} from "../constants/constants";
import { lunaFormatter } from "../utils/CurrencyHelper";
import { toUserReadableError } from "../utils/ErrorHelper";

export function useRewardsDialog() {
  return useDialog(RewardsDialog);
}

interface Props {
  closeDialog?: any;
  title?: string;
  strategyId?: string;
  sccContractAddress: any;
  rewards: any;
}

function RewardsDialog({
  title,
  strategyId,
  sccContractAddress,
  rewards,
  closeDialog,
}: Props) {
  const { walletAddress, ustBalance, terra, updateWalletBalance } =
    useAppContext();
  const wallet = useWallet();

  const queryClient = useQueryClient();

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

  const getLunaxMinted = (): number => {
    return rewards.total_rewards / parseFloat(liquidStakingState.exchange_rate);
  };

  const logFirebaseEvent = (eventName: string) => {
    const analytics = getAnalytics();
    logEvent(analytics, eventName);
  };

  const redeemRewards = async (redirectToLunaX: boolean) => {
    if (walletAddress && walletAddress !== "") {
      setSpinner(true);
      let msgs = [];
      msgs.push(
        new MsgExecuteContract(walletAddress, sccContractAddress.addr, {
          undelegate_rewards: {
            amount: `${parseFloat(rewards.total_rewards).toFixed()}`,
            strategy_id: strategyId,
          },
        })
      );
      if (redirectToLunaX) {
        msgs.push(
          new MsgExecuteContract(
            walletAddress,
            config.contractAddresses.liquidStaking,
            {
              deposit: {},
            },
            { uluna: Math.floor(rewards.total_rewards) }
          )
        );
      }

      try {
        const fee = await terra.tx.estimateFee(walletAddress, msgs);
        console.log("fee", fee);
        // Create and sign transaction
        let ustWalletBalance = ustBalance;
        if (ustWalletBalance < ustFee || !ustWalletBalance) {
          throw Error("InsufficientUST");
        } else {
          const txfee = redirectToLunaX ? ustConvertToLunaX : ustFee;
          const tx = await wallet.post({
            msgs,
            fee: new StdFee(fee.gas, `${(txfee * 1000000).toFixed()}uusd`),
            memo: `${redirectToLunaX ? REDIRECT_TO_LUNAX : WITHDRAW_FUNDS}`,
          });

          if (!(!!tx.result && !!tx.result.txhash)) {
            throw Error("Failed to send transaction");
          } else {
            await new Promise((resolve) => {
              setTimeout(async () => {
                resolve(
                  await queryClient.refetchQueries([
                    SP_PORTFOLIO_HOLDING,
                    walletAddress,
                  ])
                );
              }, 5000);
            });
            if (redirectToLunaX) {
              setSuccessMessage(`${lunaFormatter(
                rewards.total_rewards
              )} Luna has been exchanged for
              ${lunaFormatter(getLunaxMinted())} LunaX!`);
            } else {
              setSuccessMessage("Your funds have been withdrawn!");
            }

            setSuccess(true);
            logFirebaseEvent("claimed_rewards");
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
              {/* <p className="message">This is a message</p> */}
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
                    {lunaFormatter(rewards.total_rewards)}{" "}
                    <span className="amount-currency">LUNA</span>
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
                <LunaXRedirectionInfo />
              </div>
              <Typography fontWeight="bold" variant="body3" className="mt-3">
                Select an option
              </Typography>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <WithdrawFundTable
                  withdrawFundsAction={redeemRewards}
                  isWithdrawFundsDialog={false}
                />
                <RedirectToLunaXTable
                  withdrawFundsAction={redeemRewards}
                  isWithdrawFundsDialog={false}
                />
              </div>
              <Link
                href={LINK_LUNAX_OVER_LUNA}
                variant={"gradient"}
                className="mt-10 place-content-center"
                target={"_blank"}
              >
                Why is LunaX better than Luna?
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
