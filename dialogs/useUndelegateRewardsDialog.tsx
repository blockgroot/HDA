import React, { useCallback, useState } from "react";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  demicrofy,
  formatUSTWithPostfixUnits,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from "@anchor-protocol/notation";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import { InputAdornment, Modal } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { useDialog } from "@terra-dev/use-dialog";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";

import { firebase } from "../utils/firebase";

import SDButton from "../components/common/SDButton";
import { toUserReadableError } from "../utils/ErrorHelper";
import Loader from "../components/common/Loader";
import SuccessAnimation from "../components/common/SuccessAnimation";
import { messageMemo, ustFee } from "../constants/constants";
import { SP_PORTFOLIO_HOLDING } from "@constants/queriesKey";
import { useAppContext } from "@libs/appContext";
import { useWallet } from "@terra-money/wallet-provider";
import { useQueryClient } from "react-query";

export function useUndelegateRewardsDialog() {
  return useDialog(UndelegateDialog);
}

interface Props {
  closeDialog?: any;
  title?: string;
  strategyId?: string;
  maxAmount: number;
  contractAddress: any;
}

function UndelegateDialog({
  title,
  strategyId,
  maxAmount,
  contractAddress,
  closeDialog,
}: Props) {
  const { walletAddress, ustBalance, terra } = useAppContext();
  const wallet = useWallet();

  const queryClient = useQueryClient();

  let firebaseApp = firebase;

  const [errMsg, setErrMsg] = useState("");
  const [undelegateAmount, setUndelegateAmount] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState("");
  const [estimatedTransactionFee, setEstimatedTransactionFee] = useState(0.05);
  const [estimatedGasFee, setEstimatedGasFee] = useState(0);

  const updateUndelegateAmount = useCallback((nextUndelegateAmount) => {
    setUndelegateAmount(nextUndelegateAmount);
    computeTransactionCharges(nextUndelegateAmount);
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
    if (walletAddress && walletAddress !== "") {
      setSpinner(true);

      let amount: any = parseFloat(undelegateAmount) * 1000000;
      amount = amount.toFixed();

      const msg = new MsgExecuteContract(walletAddress, contractAddress.addr, {
        undelegate_rewards: {
          amount,
          strategy_id: strategyId,
        },
      });
      try {
        // Create and sign transaction
        let ustWalletBalance = ustBalance;

        if (ustWalletBalance < ustFee || !ustWalletBalance) {
          throw Error("InsufficientUST");
        } else if (parseFloat(undelegateAmount) > maxAmount) {
          throw Error(
            "Failed to send transaction - You are trying to unbound more amount than deposited"
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
    amount = (parseFloat(amount) * 1000000).toFixed();

    const msg = new MsgExecuteContract(walletAddress, contractAddress.addr, {
      undelegate_rewards: {
        amount,
        strategy_id: strategyId,
      },
    });

    msgs.push(msg);
    msgs &&
      msgs.length > 0 &&
      terra &&
      terra.tx
        .estimateFee(walletAddress, msgs)
        .then((fee: any) => {
          let estimatedFee = parseFloat(
            formatUSTWithPostfixUnits(demicrofy(fee.amount._coins.uluna.amount))
          );

          setEstimatedTransactionFee(estimatedFee);
          setEstimatedGasFee(fee.gas);
        })
        .catch((err: any) => console.log("Error"));
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
              <p className="title mb-4">{title}</p>

              <div>
                <NumberInput
                  style={{ fontSize: 20 }}
                  className="amount"
                  value={undelegateAmount}
                  maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
                  maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
                  label="AMOUNT"
                  onChange={({ target }) => {
                    setSelectedPercentage("");
                    updateUndelegateAmount(target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">LUNA</InputAdornment>
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
                {undelegateAmount && parseInt(undelegateAmount) > 0 ? (
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
                    Undelegation takes 21 days to complete
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    You would not earn rewards in the meantime
                  </li>
                </ul>
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
                disabled={!wallet || estimatedGasFee <= 0}
                onClick={() => wallet && undelegate()}
              />
            </div>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}
