import React, { useEffect, useState } from "react";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Modal } from "@material-ui/core";
import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from "@anchor-protocol/notation";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { useDialog } from "@terra-dev/use-dialog";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import { firebase } from "../utils/firebase";

import SDButton from "../components/common/SDButton";
import { toUserReadableError } from "../utils/ErrorHelper";
import Loader from "../components/common/Loader";
import SuccessAnimation from "../components/common/SuccessAnimation";
import { messageMemo, NATIVE_TOKEN_LABEL, ustFee } from "../constants/constants";
import { nativeTokenFormatter } from "../utils/CurrencyHelper";

export function useLiquidStakingWithdrawFundsDialog() {
  return useDialog(LiquidStakingWithdrawFundsDialog);
}

interface Props {
  className?: any;
  closeDialog?: any;
  contractAddress: string;
  primaryWalletAddress: string;
  wallet: any;
  amount: number;
  undelegationBatchId: number;
  refreshPage?: any;
  terra: any;
  walletFunds: any;
  protocolFee: number;
}

function LiquidStakingWithdrawFundsDialog({
  className,
  contractAddress,
  closeDialog,
  primaryWalletAddress,
  wallet,
  amount,
  undelegationBatchId,
  refreshPage,
  terra,
  walletFunds,
  protocolFee,
}: Props) {
  console.log(
    className,
    contractAddress,
    closeDialog,
    primaryWalletAddress,
    wallet,
    amount,
    undelegationBatchId,
    refreshPage,
    terra,
    walletFunds,
    protocolFee
  );
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

  useEffect(() => {}, []);

  const logFirebaseEvent = (eventName: string) => {
    const analytics = getAnalytics();
    logEvent(analytics, eventName);
  };

  const withdrawFunds = async () => {
    if (primaryWalletAddress && primaryWalletAddress !== "") {
      setSpinner(true);

      const msg = new MsgExecuteContract(
        primaryWalletAddress,
        contractAddress,
        {
          withdraw_funds_to_wallet: {
            batch_id: undelegationBatchId, // present in user UndelegationInfo
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
            fee: new StdFee(500000, `${(ustFee * 1000000).toFixed()}uusd`),
            memo: messageMemo,
          });

          if (!(!!tx.result && !!tx.result.txhash)) {
            throw Error("Failed to send transaction");
          } else {
            // let transactionType = transactionsTypeMap.WITHDRAW_FUNDS;
            // let coins = [
            // 	{
            // 		denom: "uluna",
            // 		amount: `${amount.toFixed()}`,
            // 	},
            // ];
            // let txhash = tx.result.txhash;
            // let userAddress = primaryWalletAddress;

            // const payload = {
            // 	transactionType,
            // 	coins,
            // 	txhash,
            // 	userAddress,
            // 	poolId: `${poolId}`,
            // };

            // const response = await saveTransaction(payload);
            setSuccess(true);
            logFirebaseEvent("claimed_undelegated_funds");
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

  const computeTransactionCharges = () => {
    let msgs: any[] = [];
    let estimatedFee = "0.05";

    const msg = new MsgExecuteContract(primaryWalletAddress, contractAddress, {
      withdraw_funds_to_wallet: {
        batch_id: undelegationBatchId, // present in user UndelegationInfo
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
            formatUSTWithPostfixUnits(demicrofy(fee.amount._coins.uNativeToken.amount))
          ).toFixed(2);

          setEstimatedTransactionFee(estimatedFee);
          setEstimatedGasFee(fee.gas);
        })
        .catch((err: any) => console.log("Error"));
  };

  const closeAndRefresh = () => {
    setSuccess(false);
    closeDialog();
    refreshPage();
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

              <p className="message">Your funds have been withdrawn.</p>
              <SDButton
                className="success-button"
                text="OK"
                onClick={() => closeAndRefresh()}
              />
            </div>
          ) : (
            <div>
              <p className="dialogHeader">Withdrawals</p>
              <div className="contract-details">
                <div>
                  <p className="amount-display">
                    {nativeTokenFormatter(amount)}{" "}
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
              {errMsg && errMsg !== "" && (
                <div className="error-message">
                  <CancelOutlinedIcon fontSize="small" className="errorIcon" />
                  <span>{errMsg}</span>
                </div>
              )}
              <SDButton
                className="proceed"
                text="Confirm"
                disabled={!wallet || spinner}
                onClick={() => wallet && withdrawFunds()}
              />
            </div>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}
