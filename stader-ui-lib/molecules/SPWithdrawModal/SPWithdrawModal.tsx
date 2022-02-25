import { Button, Loader, SuccessAnimation, Typography } from "@atoms/index";
import Link from "@atoms/Link/Link";
import {
  LINK_LUNAX_OVER_LUNA,
  REDIRECT_TO_LUNAX,
  ustConvertToLunaX,
  ustFee,
  WITHDRAW_FUNDS,
} from "@constants/constants";
import { SP_PORTFOLIO_HOLDING } from "@constants/queriesKey";
import { defaultLiquidStakingState } from "@constants/sp-portfolio";
import { useAppContext } from "@libs/appContext";
import { Modal } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { LunaXRedirectionInfo } from "@molecules/LunaXRedirectionInfo/LunaXRedirectionInfo";
import { RedirectToLunaXTable } from "@molecules/RedirectToLunaXTable/RedirectToLunaXTable";
import { WithdrawFundTable } from "@molecules/WithdrawFundsTable/WithdrawFundsTable";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import { useWallet } from "@terra-money/wallet-provider";
import { LiquidStakingState } from "@types_/liquid-staking-pool";
import { SPWithdrawModalProps } from "@types_/portfolio";
import { lunaFormatter } from "@utils/CurrencyHelper";
import { toUserReadableError } from "@utils/ErrorHelper";
import { config } from "config/config";
import { getAnalytics, logEvent } from "firebase/analytics";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

function WithdrawFundsDialog(props: SPWithdrawModalProps) {
  const {
    poolsContractAddress,
    title,
    onClose,
    amount,
    poolId,
    undelegationBatchId,
    undelegationId,
    open,
  } = props;

  const { terra, walletAddress, ustBalance, updateWalletBalance } =
    useAppContext();
  const wallet = useWallet();

  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [liquidStakingState, setLiquidStakingState] =
    useState<LiquidStakingState>(defaultLiquidStakingState);

  function setErrorMsgForFailure(
    errorMessage = "Something did not go right. Please try again!"
  ) {
    return errorMessage;
  }

  const logFirebaseEvent = (eventName: string) => {
    const analytics = getAnalytics();
    logEvent(analytics, eventName);
  };

  const withdrawFunds = async (redirectToLunaX: boolean) => {
    if (walletAddress) {
      let msgs: MsgExecuteContract[] = [];
      msgs.push(
        new MsgExecuteContract(walletAddress, poolsContractAddress.addr, {
          withdraw_funds_to_wallet: {
            pool_id: poolId,
            batch_id: undelegationBatchId, // present in user UndelegationInfo
            undelegate_id: undelegationId, // present in user UndelegationInfo
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
            { uluna: Math.floor(amount) }
          )
        );
      }

      try {
        // Create and sign transaction
        const fee = await terra.tx.estimateFee(walletAddress, msgs);
        if (ustBalance < ustFee || !ustBalance) {
          await Promise.reject(Error("Insufficient UST"));
        } else {
          const txfee = redirectToLunaX ? ustConvertToLunaX : ustFee;
          const tx = await wallet.post({
            msgs,
            fee: new StdFee(fee.gas, `${(txfee * 1000000).toFixed()}uusd`),
            memo: `${redirectToLunaX ? REDIRECT_TO_LUNAX : WITHDRAW_FUNDS}`,
          });

          if (!(!!tx.result && !!tx.result.txhash)) {
            await Promise.reject(Error("Failed to send transaction"));
          } else {
            logFirebaseEvent("claimed_undelegated_funds");
          }
        }

        await queryClient.refetchQueries([SP_PORTFOLIO_HOLDING, walletAddress]);
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(updateWalletBalance());
          }, 4000);
        });
        if (redirectToLunaX) {
          setSuccessMessage(`${lunaFormatter(
            amount
          )} Luna has been exchanged for
          ${lunaFormatter(getLunaxMinted())} LunaX!`);
        } else {
          setSuccessMessage("Your funds have been withdrawn!");
        }
        return { success: true, message: "Success" };
      } catch (err: any) {
        // Could not even locate keys or type for this err. Relying on a hack.
        throw setErrorMsgForFailure(toUserReadableError(err.toString()));
      }
    }
  };
  const {
    mutate: withdrawFundsAction,
    isSuccess,
    reset,
    error,
    isLoading,
  } = useMutation(withdrawFunds);

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
    return amount / parseFloat(liquidStakingState.exchange_rate);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} className="dialog">
      <Dialog className="dialog-container" onClose={handleClose}>
        <div className="w-full">
          {isLoading && !isSuccess ? (
            <div className="loader-container">
              <Loader />
              <p className="loader-text-message">
                Your transaction is in progress...
              </p>
            </div>
          ) : !isLoading && isSuccess ? (
            <div className="success-container">
              <div className="success-icon">
                <SuccessAnimation />
              </div>
              <p className="message">{successMessage}</p>
              <Button
                className="success-button"
                onClick={handleClose}
                variant={"solid"}
                size={"large"}
                disabled={!wallet || isLoading}
              >
                OK
              </Button>
            </div>
          ) : (
            <div>
              <p className="dialogHeader">Withdraw Funds</p>
              <p className="title m-0">{title}</p>
              <div className="contract-details">
                <div>
                  <p className="amount-display">
                    {lunaFormatter(amount)}{" "}
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
                  withdrawFundsAction={withdrawFundsAction}
                  isWithdrawFundsDialog={true}
                />
                <RedirectToLunaXTable
                  withdrawFundsAction={withdrawFundsAction}
                  isWithdrawFundsDialog={true}
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
              {error && (
                <div className="error-message">
                  <CancelOutlinedIcon fontSize="small" className="errorIcon" />
                  <span>{error as string}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}

export default WithdrawFundsDialog;
