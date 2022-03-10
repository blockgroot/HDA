import React, { useCallback, useState } from "react";
import { Grid, InputAdornment, Modal, Tooltip } from "@material-ui/core";
import { NATIVE_TOKEN_LABEL, tooltips } from "@constants/constants";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { useDialog } from "@terra-dev/use-dialog";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import arrowBack from "../assets/svg/arrow_back.svg";
import { nativeTokenFormatter } from "../utils/CurrencyHelper";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import {
  NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS,
  NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS,
  ustFee
} from "../constants/constants";
import moment from "moment";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { toUserReadableError } from "@utils/ErrorHelper";
import { useAppContext } from "@libs/appContext";
import { ButtonOutlined } from "@atoms/Button/Button";
import SuccessAnimationWhite from "../components/common/SuccessAnimationWhite";
import LoaderWhite from "../components/common/LoaderWhite";
import { config } from "../config/config";

export function useStakeUnDelegationDialog() {
  return useDialog(StakeUnDelegationDialog);
}

interface Props {
  closeDialog?: any;
  refreshPage: any;
  wallet?: any;
  walletAddress?: any;
  terra?: any;
  walletBalance?: any;
  allUndelegationValidator?: any;
}

function StakeUnDelegationDialog({
  closeDialog,
  refreshPage,
  wallet,
  walletAddress,
  terra,
  walletBalance,
  allUndelegationValidator,
}: Props) {
  const [withdrawContent, setWithdrawContent] = useState(false);
  const [undelegateWithrawData, setUndelegateWithrawData] = useState<any>("");
  const [spinner, setSpinner] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [validationMsg, setValidationMsg] = useState<string>("");
  const { ustBalance } = useAppContext();
  const isWalletConnected: boolean = !!walletAddress && walletAddress !== "";
  const loadingMessage = spinner ? "Your withdraw is under process..." : null;

  const closeAndRefresh = () => {
    closeDialog();
  };

  const viewWithdrawContent = (undelegation: any) => {
    setUndelegateWithrawData(undelegation);
    setWithdrawContent(true);
  };

  const goBack = () => {
    setWithdrawContent(false);
  };

  const postTransaction = async (
    walletAddress: string,
    msg: MsgExecuteContract
  ) => {
    if (terra && wallet) {
      const fee = await terra.tx.estimateFee(walletAddress, [msg]);
      const transaction = {
        msgs: [msg],
        memo: "STADER",
      };

      const feeInUst = ustFee;
      if (fee?.gas) {
        // @ts-ignore
        transaction.fee = new StdFee(
          fee.gas,
          `${(feeInUst * 1000000).toFixed()}uusd`
        );
      }
      const result = await wallet.post(transaction);
      return result;
    } else {
      return {};
    }
  };

  const withdrawToWallet = useCallback(async (contractAddress, batchId) => {
    try {
      setSpinner(true);
      const msg = new MsgExecuteContract(walletAddress, contractAddress, {
        withdraw_funds_to_wallet: { batch_id: batchId },
      });

      const txResult: any = await postTransaction(walletAddress, msg);

      if (!(!!txResult.result && !!txResult.result.txhash)) {
        throw Error("Failed to send transaction");
      }

      await new Promise((r) => setTimeout(r, 10000));
      await refreshPage();

      setSpinner(false);
      setSuccessMessage(`Your withdraw is successful!`);
    } catch (err: any) {
      setSpinner(false);
      setErrorMessage(toUserReadableError(err.toString()));
      setTimeout(() => setErrorMessage(""), 3000);
      throw toUserReadableError(err.toString());
    }
  }, []);

  const undelegation = allUndelegationValidator.map((item: any, i: number) => {
    return (
      <div key={i}>
        {item.map((subitem: any, index: number) => {
          return (
            <div key={index}>
              {subitem?.amount != "0" ? (
                <Grid container spacing={3}>
                  <Grid item xs={3} md={3}>
                    <p className="row-item">
                      <div className="flex v-center">
                        <div className="flex">
                          {config.network.name == "mainnet" ? (
                            <img
                              className="validatorImage"
                              src={
                                "/static/" +
                                subitem?.validator_info?.operator_address +
                                ".png"
                              }
                              alt=""
                            />
                          ) : (
                            <img
                              className="validatorImage"
                              src={
                                "/static/terravaloper1t90gxaawul292g2vvqnr3g0p39tw5v6vsk5p96.png"
                              }
                              alt=""
                            />
                          )}
                        </div>
                        <div className="flex ml-2">
                          {subitem?.validator_info?.validator_name}
                        </div>
                      </div>
                    </p>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <p className="row-item txt-center">
                      {nativeTokenFormatter(subitem?.amount).toFixed(6)} {NATIVE_TOKEN_LABEL}
                    </p>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <p className="row-item txt-center">
                      {subitem?.batch_info?.batch?.est_release_time}{" "}
                      {subitem?.batch_info?.batch?.est_release_time ? (
                        "UTC"
                      ) : (
                        <div>
                          <span>Undelegation in progress</span>
                          <Tooltip
                            title={tooltips.withdrawals}
                            classes={{ tooltip: "tooltip", arrow: "arrow" }}
                            placement={"bottom"}
                            arrow
                          >
                            <InfoOutlinedIcon
                              className={"ml-2"}
                              style={{ fontSize: 16 }}
                            />
                          </Tooltip>
                        </div>
                      )}
                    </p>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <p
                      className={
                        !subitem?.batch_info?.batch?.est_release_time ||
                        moment().isBefore(
                          moment(subitem?.batch_info?.batch?.est_release_time)
                        )
                          ? "row-item txt-right undelegate-withdraw-link withdraw-disabled"
                          : "row-item txt-right undelegate-withdraw-link"
                      }
                      onClick={() => {
                        !subitem?.batch_info?.batch?.est_release_time ||
                        moment().isBefore(
                          moment(subitem?.batch_info?.batch?.est_release_time)
                        )
                          ? null
                          : viewWithdrawContent(subitem);
                      }}
                    >
                      Withdraw {">"}
                    </p>
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <Modal open onClose={() => closeDialog()} className="dialog">
      <Dialog className="stake-dialog-container" onClose={() => closeDialog()}>
        <div className="stake-wrap">
          {!withdrawContent ? (
            <div>
              <p className="stake-dialog-title">Undelegations</p>
              <Grid container spacing={2}>
                <Grid item xs={3} md={3}>
                  <p className="row-title">
                    Validators({allUndelegationValidator?.length})
                  </p>
                </Grid>
                <Grid item xs={3} md={3}>
                  <p className="row-title txt-center">Amount</p>
                </Grid>
                <Grid item xs={3} md={3}>
                  <p className="row-title txt-center">Release Time</p>
                </Grid>
                <Grid item xs={3} md={3}></Grid>
              </Grid>
              {undelegation}
            </div>
          ) : (
            <div>
              {loadingMessage ? (
                <div className="loader-container">
                  <p className="loader-text-message">
                    <LoaderWhite classes={"loaderContainer"} />
                    {loadingMessage}
                  </p>
                </div>
              ) : successMessage ? (
                <div className="undelegate-container">
                  <div className="back-btn">
                    <img
                      src={arrowBack}
                      alt="Back"
                      width={25}
                      onClick={() => {
                        goBack();
                      }}
                    />
                  </div>
                  <div className="success-container">
                    <div className="success-image">
                      <SuccessAnimationWhite />
                    </div>
                    <p className="message">{successMessage}</p>
                  </div>
                </div>
              ) : (
                <div className="widthdraw-fund">
                  <div className="back-btn">
                    <img
                      src={arrowBack}
                      alt="Back"
                      width={25}
                      onClick={() => {
                        goBack();
                      }}
                    />
                  </div>
                  <p className="stake-dialog-title">Withdraw Funds</p>
                  <div>
                    <label>Community</label>
                    <div className="undelegateChargeContainer">
                      <NumberInput
                        style={{ fontSize: 20, opacity: 1 }}
                        className="amount"
                        value={nativeTokenFormatter(undelegateWithrawData.amount)}
                        maxIntegerPoinsts={NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS}
                        maxDecimalPoints={NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS}
                        label="AMOUNT"
                        disabled={true}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              Transaction Fee: {ustFee}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </div>
                  <div className="text undelegate-para">
                    <p>Funds withdrawn will go to your wallet</p>
                  </div>
                  <div>
                    <ButtonOutlined
                      className="stake-confirm-btn"
                      disabled={!isWalletConnected || ustBalance < ustFee}
                      onClick={() => {
                        withdrawToWallet(
                          undelegateWithrawData.validator_info.contract_address,
                          undelegateWithrawData.batch_id
                        );
                      }}
                    >
                      Confirm
                    </ButtonOutlined>
                  </div>
                  {ustBalance < ustFee ? (
                    <p className="mt-3 text-center validation">
                      Not enough ust for transaction fee
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          )}
          {errorMessage && (
            <div className="error-message">
              <CancelOutlinedIcon fontSize="small" className="errorIcon" />
              <span>{errorMessage as string}</span>
            </div>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}
