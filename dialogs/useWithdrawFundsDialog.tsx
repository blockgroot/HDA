import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from "@anchor-protocol/notation";
import { Modal } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { useDialog } from "@terra-dev/use-dialog";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import { getAnalytics, logEvent } from "firebase/analytics";
import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import SDButton from "../components/common/SDButton";
import SuccessAnimation from "../components/common/SuccessAnimation";
import { messageMemo, ustFee } from "../constants/constants";
import { lunaFormatter } from "../utils/CurrencyHelper";
import { toUserReadableError } from "../utils/ErrorHelper";
import { firebase } from "../utils/firebase";

export function useWithdrawFundsDialog() {
  return useDialog(WithdrawFundsDialog);
}

interface Props {
  className?: any;
  closeDialog?: any;
  title: string;
  contractAddress: any;
  primaryWalletAddress: string;
  wallet: any;
  amount: number;
  poolId: number;
  undelegationBatchId: number;
  undelegationId: number;
  refreshPage?: any;
  terra: any;
  walletFunds: any;
  protocolFee: number;
  gasPrices: any;
}

function WithdrawFundsDialog({
  className,
  contractAddress,
  title,
  closeDialog,
  primaryWalletAddress,
  wallet,
  amount,
  poolId,
  undelegationBatchId,
  undelegationId,
  refreshPage,
  terra,
  walletFunds,
  protocolFee,
  gasPrices,
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

  const withdrawFunds = async () => {
    if (primaryWalletAddress && primaryWalletAddress !== "") {
      setSpinner(true);

      const msg = new MsgExecuteContract(
        primaryWalletAddress,
        contractAddress.addr,
        {
          withdraw_funds_to_wallet: {
            pool_id: poolId,
            batch_id: undelegationBatchId, // present in user UndelegationInfo
            undelegate_id: undelegationId, // present in user UndelegationInfo
            amount: `${amount.toFixed()}`,
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

    const msg = new MsgExecuteContract(
      primaryWalletAddress,
      contractAddress.addr,
      {
        withdraw_funds_to_wallet: {
          pool_id: poolId,
          batch_id: undelegationBatchId, // present in user UndelegationInfo
          undelegate_id: undelegationId, // present in user UndelegationInfo
          amount: `${parseFloat(amount.toFixed())}`,
        },
      }
    );

    msgs.push(msg);
    msgs &&
      msgs.length > 0 &&
      terra &&
      terra.tx
        .estimateFee(primaryWalletAddress, msgs)
        .then((fee: any) => {
          estimatedFee = parseFloat(
            formatUSTWithPostfixUnits(demicrofy(fee.amount._coins.uluna.amount))
          ).toFixed(2);

          setEstimatedTransactionFee(estimatedFee);
          setEstimatedGasFee(fee.gas);
        })
        .catch((err: any) => console.log("Error"));
  };

  const closeAndRefresh = () => {
    setSuccess(false);
    closeDialog();
    if (refreshPage) {
      refreshPage();
    }
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
              <ul className="rewardsListItem" style={{ marginTop: 40 }}>
                <li style={{ marginBottom: 8 }}>
                  Funds withdrawn will go to your wallet.
                </li>
              </ul>

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
                onClick={() => wallet && withdrawFunds()}
              />
            </div>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}
