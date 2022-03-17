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

import { firebase } from "../utils/firebase";

import SDButton from "../components/common/SDButton";
import { toUserReadableError } from "../utils/ErrorHelper";
import Loader from "../components/common/Loader";
import SuccessAnimation from "../components/common/SuccessAnimation";
import { saveTransaction } from "../services/transactions";
import {
  messageMemo,
  transactionsTypeMap,
  ustFee,
} from "../constants/constants";

export function useAirdropsLiquidTokenDialog() {
  return useDialog(AirdropsLiquidTokenDialog);
}

interface Props {
  className?: any;
  closeDialog?: any;
  refreshPage: any;
  terra: any;
  walletFunds: any;
  contractAddress: string;
  primaryWalletAddress: string;
  wallet: any;
  airdrops: any;
}

function AirdropsLiquidTokenDialog({
  contractAddress,
  closeDialog,
  refreshPage,
  terra,
  walletFunds,
  primaryWalletAddress,
  wallet,
  airdrops,
}: Props) {
  let firebaseApp = firebase;

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

  const redeemAirdrops = async () => {
    // Create a message
    if (primaryWalletAddress && primaryWalletAddress !== "") {
      setSpinner(true);

      let tokensToWithdraw = airdrops
        .filter((airdrop: any) => {
          return parseInt(airdrop.amount) > 0;
        })
        .map((airdropToken: any) => {
          return airdropToken.denom;
        });

      const msg = new MsgExecuteContract(
        primaryWalletAddress,
        contractAddress,
        {
          withdraw_tokens: {
            denoms_to_withdraw: tokensToWithdraw,
          },
        }
      );

      try {
        // Create and sign transaction
        let ustWalletBalance =
          walletFunds &&
          walletFunds.uusd &&
          formatUSTWithPostfixUnits(demicrofy(walletFunds.uusd));
        ustWalletBalance =
          ustWalletBalance && parseInt(ustWalletBalance.replaceAll(",", ""));
        if (ustWalletBalance < ustFee || !ustWalletBalance) {
          throw Error("InsufficientUST");
        } else {
          const tx = await wallet.post({
            msgs: [msg],
            fee: new StdFee(
              estimatedGasFee,
              `${(ustFee * 1000000).toFixed()}uusd`
            ),
            memo: messageMemo,
          });

          if (!(!!tx.result && !!tx.result.txhash)) {
            throw Error("Failed to send transaction");
          } else {
            // let transactionType = transactionsTypeMap.WITHDRAW_AIRDROPS;
            // let coins = airdrops;
            // let txhash = tx.result.txhash;
            // let userAddress = primaryWalletAddress;

            // const payload = {
            // 	transactionType,
            // 	coins,
            // 	txhash,
            // 	userAddress,
            // };

            // const response = await saveTransaction(payload);
            logFirebaseEvent("claimed_airdrops_liquid_staking");
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
    refreshPage(primaryWalletAddress);
  };

  const computeTransactionCharges = () => {
    let msgs: any[] = [];
    let estimatedFee = "0.05";

    let tokensToWithdraw = airdrops
      .filter((airdrop: any) => {
        return parseInt(airdrop.amount) > 0;
      })
      .map((airdropToken: any) => {
        return airdropToken.denom;
      });

    const msg = new MsgExecuteContract(primaryWalletAddress, contractAddress, {
      withdraw_tokens: {
        denoms_to_withdraw: tokensToWithdraw,
      },
    });

    msgs.push(msg);
    msgs &&
      msgs.length > 0 &&
      terra &&
      terra.tx
        .estimateFee(primaryWalletAddress, msgs)
        .then((fee: any) => {
          estimatedFee = parseFloat(
            formatUSTWithPostfixUnits(
              demicrofy(fee.amount._coins.uNativeToken.amount)
            )
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

              <p className="message">
                The airdrops withdrawn are sent to your wallet
              </p>
              <SDButton
                className="success-button"
                text="OK"
                onClick={() => closeAndRefresh()}
              />
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
              <SDButton
                className="proceed"
                text="Confirm"
                disabled={!wallet || spinner || estimatedGasFee <= 0}
                onClick={() => wallet && redeemAirdrops()}
              />
            </div>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}
