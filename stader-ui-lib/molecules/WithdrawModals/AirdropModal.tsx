import { useEffect } from "react";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from "@anchor-protocol/notation";
import { Modal } from "@material-ui/core";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { useDialog } from "@terra-dev/use-dialog";
import React, { useState } from "react";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import { toUserReadableError } from "@utils/ErrorHelper";
import { messageMemo, ustFee } from "@constants/constants";
import { useAppContext } from "@libs/appContext";
import { Loader, SuccessAnimation, Button } from "@atoms/index";
import { useWallet } from "@terra-money/wallet-provider";
import { useQueryClient } from "react-query";
import { SP_PORTFOLIO_HOLDING } from "@constants/queriesKey";

export function useAirdropsDialog() {
  return useDialog(AirdropsDialog);
}

interface Props {
  closeDialog?: any;
  refreshPage?: any;
  sccContractAddress: any;
  cfsccContractAddress: any;
  cfsccAirdrops: any;
  sccAirdrops: any;
}

function AirdropsDialog({
  sccContractAddress,
  cfsccContractAddress,
  closeDialog,
  refreshPage,
  cfsccAirdrops,
  sccAirdrops,
}: Props) {
  const { terra, ustBalance, walletAddress, updateWalletBalance } =
    useAppContext();
  const wallet = useWallet();
  const queryClient = useQueryClient();
  const [errMsg, setErrMsg] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [success, setSuccess] = useState(false);
  const [estimatedTransactionFee, setEstimatedTransactionFee] =
    useState("0.05");
  const [estimatedGasFee, setEstimatedGasFee] = useState(0);

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
    computeTransactionCharges();
  }, []);

  const logFirebaseEvent = (eventName: string) => {
    const analytics = getAnalytics();
    logEvent(analytics, eventName);
  };

  const canWithdrawAirdrops = (airdrops: any) => {
    const areAirdropsPresent = airdrops.some((airdrop: any) => {
      return parseInt(airdrop.amount) > 0;
    });

    return areAirdropsPresent;
  };

  const redeemAirdrops = async () => {
    // Create a message
    if (walletAddress && walletAddress !== "") {
      let msgs: any[] = [];
      setSpinner(true);
      const sccMsg = new MsgExecuteContract(
        walletAddress,
        sccContractAddress.addr,
        {
          withdraw_airdrops: {},
        }
      );

      const cfsccMsg = new MsgExecuteContract(
        walletAddress,
        cfsccContractAddress.addr,
        {
          withdraw_airdrops: {},
        }
      );

      const canWithdrawAirdropsFromScc = canWithdrawAirdrops(sccAirdrops);
      const canWithdrawAirdropsFromCfScc = canWithdrawAirdrops(cfsccAirdrops);

      if (canWithdrawAirdropsFromCfScc) {
        msgs.push(cfsccMsg);
      }

      if (canWithdrawAirdropsFromScc) {
        msgs.push(sccMsg);
      }

      try {
        // Create and sign transaction
        let ustWalletBalance = ustBalance;

        if (ustWalletBalance < ustFee || !ustWalletBalance) {
          throw Error("InsufficientUST");
        } else {
          const tx = await wallet.post({
            msgs,
            fee: new StdFee(
              estimatedGasFee,
              `${(ustFee * 1000000).toFixed()}uusd`
            ),
            memo: messageMemo,
          });

          if (!(!!tx.result && !!tx.result.txhash)) {
            throw Error("Failed to send transaction");
          } else {
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(updateWalletBalance());
              }, 5000);
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

            logFirebaseEvent("claimed_airdrops");
            setSuccess(true);
          }
          setSpinner(false);
        }
      } catch (err: any) {
        // Could not even locate keys or type for this err. Relying on a hack.
        console.log("Exception Thrown|" + err.toString());
        setErrorMsgForFailure(toUserReadableError(err.toString()));
        setSpinner(false);
      }
    }
  };

  const closeAndRefresh = () => {
    setSuccess(false);
    closeDialog();
    refreshPage();
  };

  const computeTransactionCharges = () => {
    let msgs: any[] = [];
    let estimatedFee = "0.05";

    const sccMsg = new MsgExecuteContract(
      walletAddress,
      sccContractAddress.addr,
      {
        withdraw_airdrops: {},
      }
    );

    const cfsccMsg = new MsgExecuteContract(
      walletAddress,
      cfsccContractAddress.addr,
      {
        withdraw_airdrops: {},
      }
    );

    const canWithdrawAirdropsFromScc = canWithdrawAirdrops(sccAirdrops);
    const canWithdrawAirdropsFromCfScc = canWithdrawAirdrops(cfsccAirdrops);

    if (canWithdrawAirdropsFromCfScc) {
      msgs.push(cfsccMsg);
    }

    if (canWithdrawAirdropsFromScc) {
      msgs.push(sccMsg);
    }

    msgs &&
      msgs.length > 0 &&
      terra &&
      terra.tx
        .estimateFee(walletAddress, msgs)
        .then((fee: any) => {
          estimatedFee = parseFloat(
            formatUSTWithPostfixUnits(demicrofy(fee.amount._coins.uNativeToken.amount))
          ).toFixed(2);

          setEstimatedTransactionFee(estimatedFee);
          setEstimatedGasFee(fee.gas);
        })
        .catch((err: any) => console.log("Error"));
  };

  return (
    <Modal open onClose={() => closeDialog()} className="dialog">
      <Dialog className="dialog-container" onClose={() => closeDialog()}>
        <div className="w-100">
          {spinner && !success ? (
            <div className="loader-container">
              <Loader />
              <p className="loader-text-message">
                Your transaction is in progress...
              </p>
            </div>
          ) : !spinner && success ? (
            <div className="success-container">
              <div className="success-icon">
                <SuccessAnimation />
              </div>

              <p className="message">
                The airdrops withdrawn are sent to your wallet
              </p>
              <Button
                className="success-button"
                variant="solid"
                onClick={() => closeAndRefresh()}
              >
                OK
              </Button>
            </div>
          ) : (
            <div>
              <p className="dialogHeader">Withdraw Airdrops</p>
              <p className="dialogSecondaryHeader">
                Airdrops withdrawn will go to your wallet
              </p>
              <div className="airdropsChargeContainer">
                <div className="charge">
                  <p className="m-0 chargeHeader">Transaction Fee: </p>
                  <div className="chargeText">
                    <p className="m-0">{ustFee}</p>
                    <p className="mb-0 ms-1"> {"UST"}</p>
                  </div>
                </div>
              </div>
              {errMsg && errMsg !== "" && (
                <div className="error-message">
                  <CancelOutlinedIcon fontSize="small" className="errorIcon" />
                  <span>{errMsg}</span>
                </div>
              )}
              <Button
                variant="solid"
                className="proceed"
                disabled={!wallet || spinner || estimatedGasFee <= 0}
                onClick={() => wallet && redeemAirdrops()}
                // onClick={closeAndRefresh}
              >
                Confirm
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}
