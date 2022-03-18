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
import { saveTransaction } from "@services/transactions";
import { messageMemo, transactionsTypeMap, ustFee } from "@constants/constants";
import { useAppContext } from "@libs/appContext";
import { useWallet } from "@terra-money/wallet-provider";
import { Button, Loader, SuccessAnimation } from "@atoms/index";
import { config } from "../../../config/config";
import { useQueryClient } from "react-query";
import { LS_AIRDROP } from "@constants/queriesKey";

export function useLSAirdropModal() {
  return useDialog(LSAirdropModal);
}

const { airdropsContract } = config.contractAddresses;

interface Props {
  closeDialog?: any;
  refreshPage?: any;
  airdrops: any;
}

function LSAirdropModal({ closeDialog, refreshPage, airdrops }: Props) {
  const { terra, ustBalance, walletAddress } = useAppContext();
  const wallet = useWallet();

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

  const queryClient = useQueryClient();

  useEffect(() => {
    computeTransactionCharges();
  }, []);

  const logFirebaseEvent = (eventName: string) => {
    const analytics = getAnalytics();
    logEvent(analytics, eventName);
  };

  const redeemAirdrops = async () => {
    // Create a message
    if (walletAddress && walletAddress !== "") {
      setSpinner(true);

      let tokensToWithdraw = airdrops
        .filter((airdrop: any) => {
          return parseInt(airdrop.amount) > 0;
        })
        .map((airdropToken: any) => {
          return airdropToken.denom;
        });

      const msg = new MsgExecuteContract(walletAddress, airdropsContract, {
        withdraw_tokens: {
          denoms_to_withdraw: tokensToWithdraw,
        },
      });

      try {
        // Create and sign transaction
        let ustWalletBalance = ustBalance;
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
            await new Promise((resolve) => {
              setTimeout(async () => {
                resolve(
                  await queryClient.refetchQueries([LS_AIRDROP, walletAddress])
                );
              }, 4000);
            });

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
    // refreshPage(walletAddress);
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

    const msg = new MsgExecuteContract(walletAddress, airdropsContract, {
      withdraw_tokens: {
        denoms_to_withdraw: tokensToWithdraw,
      },
    });

    msgs.push(msg);
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
                className="proceed"
                variant="solid"
                disabled={!wallet || spinner || estimatedGasFee <= 0}
                onClick={() => wallet && redeemAirdrops()}
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
