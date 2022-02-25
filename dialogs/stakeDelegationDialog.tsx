import React, { useCallback, useState } from "react";
import { Grid, InputAdornment, Modal } from "@material-ui/core";
import {
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from "@anchor-protocol/notation";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { useDialog } from "@terra-dev/use-dialog";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import arrowBack from "../assets/svg/arrow_back.svg";
import { lunaFormatter } from "../utils/CurrencyHelper";
import { LUNA_MULTIPLIER, ustFee } from "../constants/constants";
import { toUserReadableError } from "@utils/ErrorHelper";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { useAppContext } from "@libs/appContext";
import { ButtonOutlined } from "@atoms/Button/Button";
import SuccessAnimationWhite from "../components/common/SuccessAnimationWhite";
import LoaderWhite from "../components/common/LoaderWhite";
import { config } from "../config/config";

type DepositLimit = {
  min: number;
  max: number;
};

export function useStakeDelegationDialog() {
  return useDialog(StakeDelegationDialog);
}

interface Props {
  closeDialog?: any;
  refreshPage: any;
  wallet?: any;
  walletAddress?: any;
  terra?: any;
  walletBalance?: any;
  allDelegateValidator?: any;
}

function StakeDelegationDialog({
  closeDialog,
  refreshPage,
  wallet,
  walletAddress,
  terra,
  walletBalance,
  allDelegateValidator,
}: Props) {
  const [viewDelegate, setViewDelegate] = useState(false);
  const [undelegateAmount, setUndelegateAmount] = useState("0");
  const [selectedPercentage, setSelectedPercentage] = useState("");
  const [spinner, setSpinner] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const isWalletConnected: boolean = !!walletAddress && walletAddress !== "";
  const [validatorData, setValidatorData] = useState<any>("");
  const [depositLimit, setDepositLimit] = useState<DepositLimit>({
    min: 0,
    max: 0,
  });
  const [validationMsg, setValidationMsg] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { ustBalance } = useAppContext();

  const loadingMessage = spinner
    ? "Your undelegation is under process..."
    : null;

  const updateUndelegateAmount = useCallback(
    (nextUndelegateAmount, maxUserAmount) => {
      const userAmount = lunaFormatter(Number(maxUserAmount));
      if (ustBalance < ustFee) {
        setValidationMsg("Not enough UST to pay for gas fees");
      } else if (nextUndelegateAmount > userAmount) {
        setValidationMsg(`You cannot undelegation more than ${userAmount}`);
      } else if (
        !nextUndelegateAmount ||
        nextUndelegateAmount == 0 ||
        nextUndelegateAmount.startsWith(".")
      ) {
        setValidationMsg("Enter a valid non zero amount");
      } else {
        setValidationMsg("");
      }

      setUndelegateAmount(nextUndelegateAmount);
    },
    []
  );

  const closeAndRefresh = () => {
    closeDialog();
  };

  const viewDelegateContent = (item: any) => {
    setValidatorData(item);
    setViewDelegate(true);
  };

  const goBack = () => {
    setViewDelegate(false);
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

  const undelegate = useCallback(async (contractAddress, undelegateAmount) => {
    try {
      setSpinner(true);

      const msg = new MsgExecuteContract(walletAddress, contractAddress, {
        queue_undelegate: {
          amount: `${(
            parseFloat(undelegateAmount) * LUNA_MULTIPLIER
          ).toFixed()}`,
        },
      });

      const txResult: any = await postTransaction(walletAddress, msg);

      if (!(!!txResult.result && !!txResult.result.txhash)) {
        throw Error("Failed to send transaction");
      }

      await new Promise((r) => setTimeout(r, 10000));
      await refreshPage();
      setSpinner(false);
      setSpinner(false);
      setSuccessMessage(`Your undelegate is successful!`);
    } catch (err: any) {
      setSpinner(false);
      setErrorMessage(toUserReadableError(err.toString()));
      setTimeout(() => setErrorMessage(""), 3000);
      throw toUserReadableError(err.toString());
    }
  }, []);

  let delegateValidator = allDelegateValidator.filter(function (item: any) {
    return item?.user_info?.total_amount?.amount != "0";
  });

  return (
    <Modal open onClose={() => closeDialog()} className="dialog">
      <Dialog className="stake-dialog-container" onClose={() => closeDialog()}>
        <div className="stake-wrap">
          {!viewDelegate ? (
            <div>
              <p className="stake-dialog-title">Delegations</p>
              <Grid container spacing={2}>
                <Grid item xs={4} md={4}>
                  <p className="row-title">
                    Validators ({delegateValidator?.length})
                  </p>
                </Grid>
                <Grid item xs={4} md={4}>
                  <p className="row-title txt-center">Amount</p>
                </Grid>
                <Grid item xs={4} md={4}></Grid>
              </Grid>
              {delegateValidator &&
                delegateValidator?.map((item: any, index: number) => (
                  <Grid container spacing={3} key={index}>
                    <Grid item xs={4} md={4}>
                      <p className="row-item">
                        <div className="flex v-center">
                          <div className="flex">
                            {config.network.name == "mainnet" ? (
                              <img
                                className="validatorImage"
                                src={
                                  "/static/" +
                                  item?.user_info?.validator_info
                                    ?.operator_address +
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
                            {item?.user_info?.validator_info?.validator_name}
                          </div>
                        </div>
                      </p>
                    </Grid>
                    <Grid item xs={4} md={4}>
                      <p className="row-item txt-center">
                        {lunaFormatter(
                          item?.user_info?.total_amount?.amount
                        ).toFixed(6)}{" "}
                        LUNA
                      </p>
                    </Grid>
                    <Grid item xs={4} md={4}>
                      <p
                        className="row-item txt-right undelegate-btn"
                        onClick={() => {
                          viewDelegateContent(item);
                        }}
                      >
                        Undelegate {">"}
                      </p>
                    </Grid>
                  </Grid>
                ))}
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
                  <div className="undelegate-head">
                    <p>Undelegate</p>
                    <p>
                      You are undelegating with{" "}
                      {validatorData?.user_info?.validator_info?.validator_name}
                    </p>
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
                        updateUndelegateAmount(
                          target.value,
                          validatorData?.user_info?.total_amount?.amount
                        );
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
                            updateUndelegateAmount(
                              (
                                0.25 *
                                lunaFormatter(
                                  Number(
                                    validatorData?.user_info?.total_amount
                                      ?.amount
                                  )
                                )
                              ).toFixed(6),
                              validatorData?.user_info?.total_amount?.amount
                            )
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
                            updateUndelegateAmount(
                              (
                                0.5 *
                                lunaFormatter(
                                  Number(
                                    validatorData?.user_info?.total_amount
                                      ?.amount
                                  )
                                )
                              ).toFixed(6),
                              validatorData?.user_info?.total_amount?.amount
                            )
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
                            updateUndelegateAmount(
                              (
                                0.75 *
                                lunaFormatter(
                                  Number(
                                    validatorData?.user_info?.total_amount
                                      ?.amount
                                  )
                                )
                              ).toFixed(6),
                              validatorData?.user_info?.total_amount?.amount
                            )
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
                          onClick={() =>
                            updateUndelegateAmount(
                              lunaFormatter(
                                Number(
                                  validatorData?.user_info?.total_amount?.amount
                                )
                              ).toFixed(6),
                              validatorData?.user_info?.total_amount?.amount
                            )
                          }
                        >
                          Max
                        </p>
                      </div>
                    </div>
                    <div className="charge">
                      <p className="m-0 chargeHeader">Transaction Fee: </p>
                      <div className="chargeText">
                        <p className="m-0">{ustFee}</p>
                        <p className="mb-0 ms-1"> {"UST"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text undelegate-para">
                    <ul>
                      <li style={{ marginBottom: 8 }}>
                        Undelegations are processed in 3-day batches and may
                        take up to 24 days. You would not earn rewards in the
                        meantime.
                      </li>
                      <li style={{ marginBottom: 8 }}>
                        Slashing events during the undelegation period may
                        affect the final amount withdrawn.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ButtonOutlined
                      className="stake-confirm-btn"
                      disabled={!isWalletConnected || !!validationMsg}
                      onClick={() =>
                        undelegate(
                          validatorData?.user_info?.validator_info
                            ?.contract_address,
                          undelegateAmount
                        )
                      }
                    >
                      Confirm
                    </ButtonOutlined>
                  </div>
                  {validationMsg ? (
                    <p className="mt-3 text-center validation">
                      {validationMsg}
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

function fetchWalletFunds(walletAddress: any) {
  throw new Error("Function not implemented.");
}
