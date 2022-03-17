import React, { useState, useCallback } from "react";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from "@anchor-protocol/notation";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import { Modal, InputAdornment } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { useDialog } from "@terra-dev/use-dialog";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";

import { firebase } from "../utils/firebase";

import SDButton from "../components/common/SDButton";
import { toUserReadableError } from "../utils/ErrorHelper";
import Loader from "../components/common/Loader";
import SuccessAnimation from "../components/common/SuccessAnimation";
import { saveTransaction } from "../services/transactions";
import {
  messageMemo,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS,
  NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS,
  transactionsTypeMap,
  ustFee,
} from "../constants/constants";

export function useUndelegateDialog() {
  return useDialog(UndelegateDialog);
}

interface Props {
  className?: any;
  closeDialog?: any;
  title?: string;
  poolId: string;
  maxAmount: number;
  contractAddress: any;
  primaryWalletAddress: string;
  wallet: any;
  refreshPage?: any;
  terra: any;
  walletFunds: any;
  protocolFee: number;
  gasPrices: any;
}

function UndelegateDialog({
  className,
  title,
  poolId,
  maxAmount,
  contractAddress,
  closeDialog,
  primaryWalletAddress,
  wallet,
  refreshPage,
  terra,
  walletFunds,
  protocolFee,
  gasPrices,
}: Props) {
  let firebaseApp = firebase;

  const [errMsg, setErrMsg] = useState("");
  const [undelegateAmount, setUndelegateAmount] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState("");
  const [validationMsg, setValidationMsg] = useState("");
  const [estimatedTransactionFee, setEstimatedTransactionFee] = useState(0.05);
  const [estimatedGasFee, setEstimatedGasFee] = useState(0);
  const updateUndelegateAmount = useCallback((nextUndelegateAmount) => {
    setUndelegateAmount(nextUndelegateAmount);
    computeTransactionCharges(nextUndelegateAmount);

    if (parseFloat(nextUndelegateAmount) > maxAmount) {
      setValidationMsg("Undelegations cannot be more than deposits");
    } else {
      setValidationMsg("");
    }
  }, []);

  function setErrorMsgForFailure(
    errorMessage = "Something did not go right. Please try again!",
    timeout = 4000
  ) {
    setErrMsg(errorMessage);
    setTimeout(() => {
      setErrMsg("");
    }, timeout);
  }

  const logFirebaseEvent = (eventName: string) => {
    const analytics = getAnalytics();
    logEvent(analytics, eventName);
  };

  const undelegate = async () => {
    if (primaryWalletAddress && primaryWalletAddress !== "") {
      setSpinner(true);

      const msg = new MsgExecuteContract(
        primaryWalletAddress,
        contractAddress.addr,
        {
          queue_undelegate: {
            amount: `${(parseFloat(undelegateAmount) * 1000000).toFixed()}`,
            pool_id: poolId,
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
        } else if (parseFloat(undelegateAmount) > maxAmount) {
          throw Error(
            "Failed to send transaction - Undelegations cannot be more than deposits"
          );
        } else {
          const txResult = await wallet.post({
            msgs: [msg],
            fee: new StdFee(
              estimatedGasFee,
              `${(ustFee * 1000000).toFixed()}uusd`
            ),
            memo: messageMemo,
          });

          if (!(!!txResult.result && !!txResult.result.txhash)) {
            throw Error("Failed to send transaction");
          } else {
            // let transactionType = transactionsTypeMap.UNDELEGATE_DEPOSIT;
            // let coins = [
            // 	{
            // 		denom: "uluna",
            // 		amount: `${(parseFloat(undelegateAmount) * 1000000).toFixed()}`,
            // 	},
            // ];
            // let txhash = txResult.result.txhash;
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
            logFirebaseEvent("clicked_undelegation");
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

  const computeTransactionCharges = (amount: string) => {
    let msgs: any[] = [];

    const msg = new MsgExecuteContract(
      primaryWalletAddress,
      contractAddress.addr,
      {
        queue_undelegate: {
          amount: `${parseFloat((parseFloat(amount) * 1000000).toFixed())}`,
          pool_id: poolId,
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
          let estimatedFee = parseFloat(
            formatUSTWithPostfixUnits(
              demicrofy(fee.amount._coins.uNativeToken.amount)
            )
          );

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

              <p className="message">Your undelegation is under process.</p>
              <SDButton
                className="success-button"
                text="OK"
                onClick={() => closeAndRefresh()}
              />
            </div>
          ) : (
            <div>
              <p className="dialogHeader">Undelegate</p>
              <div className="w-100 d-flex justify-content-between">
                <p className="title">{title}</p>
                <p className="title">
                  Deposited {NATIVE_TOKEN_LABEL}: {maxAmount}
                </p>
              </div>

              <div>
                <NumberInput
                  style={{ fontSize: 20 }}
                  className="amount"
                  value={undelegateAmount}
                  maxIntegerPoinsts={NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS}
                  maxDecimalPoints={NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS}
                  label="AMOUNT"
                  onChange={({ target }) => {
                    setSelectedPercentage("");
                    updateUndelegateAmount(target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {NATIVE_TOKEN_LABEL}
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="undelegateChargeContainer">
                <div className="optionsContainer">
                  <div
                    className={
                      selectedPercentage === "25%"
                        ? "optionItemActive"
                        : "optionItem"
                    }
                    onClick={() => setSelectedPercentage("25%")}
                  >
                    <p
                      className="optionItemText"
                      onClick={() =>
                        updateUndelegateAmount((0.25 * maxAmount).toFixed(6))
                      }
                    >
                      25%
                    </p>
                  </div>
                  <div
                    className={
                      selectedPercentage === "50%"
                        ? "optionItemActive"
                        : "optionItem"
                    }
                    onClick={() => setSelectedPercentage("50%")}
                  >
                    <p
                      className="optionItemText"
                      onClick={() =>
                        updateUndelegateAmount((0.5 * maxAmount).toFixed(6))
                      }
                    >
                      50%
                    </p>
                  </div>
                  <div
                    className={
                      selectedPercentage === "75%"
                        ? "optionItemActive"
                        : "optionItem"
                    }
                    onClick={() => setSelectedPercentage("75%")}
                  >
                    <p
                      className="optionItemText"
                      onClick={() =>
                        updateUndelegateAmount((0.75 * maxAmount).toFixed(6))
                      }
                    >
                      75%
                    </p>
                  </div>
                  <div
                    className={
                      selectedPercentage === "Max"
                        ? "optionItemActive"
                        : "optionItem"
                    }
                    onClick={() => setSelectedPercentage("Max")}
                  >
                    <p
                      className="optionItemText"
                      onClick={() => updateUndelegateAmount(maxAmount)}
                    >
                      Max
                    </p>
                  </div>
                </div>
                {undelegateAmount && parseFloat(undelegateAmount) > 0 ? (
                  <div className="charge">
                    <p className="m-0 chargeHeader">Transaction Fee: </p>
                    <div className="chargeText">
                      <p className="m-0">{ustFee} </p>
                      <p className="mb-0 ms-1"> {"UST"}</p>
                    </div>
                  </div>
                ) : null}
              </div>
              <hr />
              <div className="text">
                <ul>
                  <li style={{ marginBottom: 8 }}>
                    Only 50% of the unvested Community Farming SD Rewards will
                    vest if you Unstake {NATIVE_TOKEN_LABEL} before July 20,
                    2022
                    <a
                      href="https://blog.staderlabs.com/cf-announcement-sd-token-vesting-562944044639"
                      target="_blank"
                      rel="noreferrer"
                      className="learnMoreLink mb-0 ms-2"
                    >
                      Learn More
                    </a>
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    Undelegations are processed in 3-day batches and may take up
                    to 24 days. You would not earn rewards in the meantime.
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    Slashing events during the undelegation period may affect
                    the final amount withdrawn.
                  </li>
                </ul>
              </div>

              {errMsg && errMsg !== "" && (
                <div className="error-message">
                  <CancelOutlinedIcon fontSize="small" className="errorIcon" />
                  <span>{errMsg}</span>
                </div>
              )}
              {validationMsg && validationMsg !== "" && (
                <div className="error-message">
                  <CancelOutlinedIcon fontSize="small" className="errorIcon" />
                  <span>{validationMsg}</span>
                </div>
              )}
              <SDButton
                className="proceed"
                text="Confirm"
                disabled={
                  !wallet ||
                  parseFloat(undelegateAmount) > maxAmount ||
                  estimatedGasFee <= 0
                }
                onClick={() => wallet && undelegate()}
              />
            </div>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}
