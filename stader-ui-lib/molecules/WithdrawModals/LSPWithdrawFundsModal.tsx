import React from "react";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Modal } from "@material-ui/core";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import SDButton from "../../../components/common/SDButton";
import { toUserReadableError } from "@utils/ErrorHelper";
import Loader from "../../../components/common/Loader";
import SuccessAnimation from "../../../components/common/SuccessAnimation";
import { messageMemo, NATIVE_TOKEN_LABEL, ustFee } from "@constants/constants";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import { useAppContext } from "@libs/appContext";
import { useWallet } from "@terra-money/wallet-provider";
import { useMutation } from "react-query";
import { MutationResponseType } from "@types_/common";

interface Props {
  open: boolean;
  contractAddress: string;
  amount: number;
  undelegationBatchId: number;
  refreshPage?: any;
  protocolFee: number;
  onClose?: () => void;
}

export default function LSPWithdrawFundsModal({
  open,
  contractAddress,
  amount,
  undelegationBatchId,
  protocolFee,
  onClose,
}: Props) {
  const { ustWalletBalance, walletAddress } = useAppContext();
  const wallet = useWallet();

  const logFirebaseEvent = (eventName: string) => {
    const analytics = getAnalytics();
    logEvent(analytics, eventName);
  };

  const handleWithdrawFunds = async () => {
    const msg = new MsgExecuteContract(walletAddress, contractAddress, {
      withdraw_funds_to_wallet: {
        batch_id: undelegationBatchId, // present in user UndelegationInfo
      },
    });
    try {
      // Create and sign transaction
      let ustWalletBalanceInt = parseInt(ustWalletBalance.replaceAll(",", ""));
      if (ustWalletBalanceInt < ustFee || !ustWalletBalanceInt) {
        await Promise.reject(Error("Insufficient UST"));
      } else {
        const tx = await wallet.post({
          msgs: [msg],
          fee: new StdFee(500000, `${(ustFee * 1000000).toFixed()}uusd`),
          memo: messageMemo,
        });

        if (!(!!tx.result && !!tx.result.txhash)) {
          await Promise.reject(Error("Failed to send transaction"));
        } else {
          logFirebaseEvent("claimed_undelegated_funds");
        }
      }
      return { success: true, message: "Success" };
    } catch (err: any) {
      throw setErrorMsgForFailure(toUserReadableError(err.toString()));
    }
  };

  function setErrorMsgForFailure(
    errorMessage = "Something did not go right. Please try again!",
    timeout = 5000
  ) {
    setTimeout(() => {
      reset();
    }, timeout);
    return { message: errorMessage, success: false };
  }

  const { mutate, isLoading, isSuccess, reset, error } = useMutation<
    MutationResponseType,
    MutationResponseType
  >("LS-WITHDRAW-FUND", handleWithdrawFunds, {
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleClose = () => {
    reset();
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal open={open} className="dialog">
      <Dialog className="dialog-container" onClose={handleClose}>
        <div className="w-full">
          {isLoading && !isSuccess ? (
            <div className="loader-container">
              <Loader classes={"loaderContainer"} />
              <p className="loader-text-message">
                Your transaction is in progress...
              </p>
            </div>
          ) : !isLoading && isSuccess ? (
            <div className="success-container">
              <div className="success-icon">
                <SuccessAnimation />
              </div>

              <p className="message">Your funds have been withdrawn.</p>
              <SDButton
                className="success-button"
                text="OK"
                onClick={handleClose}
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
              {error && (
                <div className="error-message">
                  <CancelOutlinedIcon fontSize="small" className="errorIcon" />
                  <span>{error?.message}</span>
                </div>
              )}
              <SDButton
                className="proceed"
                text="Confirm"
                disabled={isLoading}
                onClick={mutate}
              />
            </div>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}
