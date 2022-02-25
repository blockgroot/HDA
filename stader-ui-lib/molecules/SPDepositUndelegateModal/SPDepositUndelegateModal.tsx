import React, { useCallback, useState } from "react";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from "@anchor-protocol/notation";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import { InputAdornment, Modal } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";

import { toUserReadableError } from "@utils/ErrorHelper";
import { messageMemo, ustFee } from "@constants/constants";
import { Button, Loader, SuccessAnimation } from "@atoms/index";
import { useAppContext } from "@libs/appContext";
import { useWallet } from "@terra-money/wallet-provider";
import { useMutation, useQueryClient } from "react-query";
import {
  SP_PORTFOLIO_DEPOSIT_UNDELEGATE,
  SP_PORTFOLIO_HOLDING,
} from "@constants/queriesKey";
import { SPDepositUndelegationModalProps } from "@types_/portfolio";
import styles from "./SPTransactionModals.module.scss";
import classNames from "classnames";

function SPDepositUndelegateModal(props: SPDepositUndelegationModalProps) {
  const { title, poolId, maxAmount, contractAddress, onClose, open } = props;
  const queryClient = useQueryClient();
  const { terra, walletAddress, ustBalance } = useAppContext();
  const wallet = useWallet();

  const [errMsg, setErrMsg] = useState("");
  const [undelegateAmount, setUndelegateAmount] = useState("");
  const [selectedPercentage, setSelectedPercentage] = useState("");
  const [validationMsg, setValidationMsg] = useState("");
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

  const handleUndelegate = async () => {
    const msg = new MsgExecuteContract(walletAddress, contractAddress.addr, {
      queue_undelegate: {
        amount: `${(parseFloat(undelegateAmount) * 1000000).toFixed()}`,
        pool_id: poolId,
      },
    });
    try {
      // Create and sign transaction

      if (ustBalance < ustFee || !ustBalance) {
        await Promise.reject(Error("Insufficient UST"));
      } else if (parseFloat(undelegateAmount) > maxAmount) {
        await Promise.reject(
          Error(
            "Failed to send transaction - Undelegations cannot be more than deposits"
          )
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
          await Promise.reject(Error("Failed to send transaction"));
        } else {
          logFirebaseEvent("clicked_undelegation");
        }
      }
      await new Promise((resolve) => {
        setTimeout(async () => {
          resolve(
            await queryClient.refetchQueries([
              SP_PORTFOLIO_HOLDING,
              walletAddress,
            ])
          );
        }, 2000);
      });

      return { success: true, message: "Undelegate successful" };
    } catch (err: any) {
      // Could not even locate keys or type for this err. Relying on a hack.
      console.log("Exception Thrown|" + err.toString());
      throw setErrorMsgForFailure(toUserReadableError(err.toString()));
    }
  };

  const { mutate, isLoading, isSuccess } = useMutation(
    [SP_PORTFOLIO_DEPOSIT_UNDELEGATE, contractAddress],
    handleUndelegate
  );

  const computeTransactionCharges = (amount: string) => {
    let msgs: any[] = [];

    const msg = new MsgExecuteContract(walletAddress, contractAddress.addr, {
      queue_undelegate: {
        amount: `${parseFloat((parseFloat(amount) * 1000000).toFixed())}`,
        pool_id: poolId,
      },
    });

    msgs.push(msg);
    msgs &&
      msgs.length > 0 &&
      terra &&
      terra.tx
        .estimateFee(walletAddress, msgs)
        .then((fee: any) => {
          setEstimatedGasFee(fee.gas);
        })
        .catch((err: any) => console.log("Error"));
  };

  return (
    <Modal open={open} onClose={onClose} className="dialog">
      <Dialog className="dialog-container" onClose={onClose}>
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

              <p className="message">Your undelegation is under process.</p>
              <Button
                variant={"solid"}
                className="success-button"
                onClick={onClose}
              >
                OK
              </Button>
            </div>
          ) : (
            <div>
              <p className="dialogHeader">Undelegate</p>
              <div className="w-full flex justify-between mb-4">
                <p className="title">{title}</p>
                <p className="title">Deposited Luna: {maxAmount}</p>
              </div>

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

              <div
                className={classNames(
                  "undelegateChargeContainer",
                  "flex-col md:flex-row"
                )}
              >
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
                <ul className={styles.list}>
                  <li>
                    Only 50% of the unvested Community Farming SD Rewards will
                    vest if you Unstake Luna before July 20, 2022
                    <a
                      href="https://blog.staderlabs.com/cf-announcement-sd-token-vesting-562944044639"
                      target="_blank"
                      rel="noreferrer"
                      className="learnMoreLink mb-0 ml-2"
                    >
                      Learn More
                    </a>
                  </li>
                  <li>
                    Move your Luna to Lunax at the time of withdrawal to keep SD token vesting as is.
                  </li>
                  <li>
                    Undelegations are processed in 3-day batches and may take up
                    to 24 days. You would not earn rewards in the meantime.
                  </li>
                  <li>
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
              <Button
                variant={"solid"}
                className="proceed"
                disabled={
                  !wallet ||
                  parseFloat(undelegateAmount) > maxAmount ||
                  estimatedGasFee <= 0
                }
                onClick={() => wallet && mutate()}
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

export default SPDepositUndelegateModal;
