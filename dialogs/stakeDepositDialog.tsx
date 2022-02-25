import React, { useCallback, useEffect, useState } from "react";
import { InputAdornment, Modal } from "@material-ui/core";
import {
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from "@anchor-protocol/notation";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { useDialog } from "@terra-dev/use-dialog";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import { useWallet } from "@terra-money/wallet-provider";
import { LUNA_MULTIPLIER, ustFeeStakePlus } from "../constants/constants";

import { useAppContext } from "@libs/appContext";
import { toUserReadableError } from "@utils/ErrorHelper";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { ButtonOutlined } from "@atoms/Button/Button";
import { lunaFormatter } from "@utils/CurrencyHelper";
import SuccessAnimationWhite from "../components/common/SuccessAnimationWhite";
import LoaderWhite from "../components/common/LoaderWhite";
import { config } from "../config/config";
import {
  StakeContractInfo,
  ValidatorStakingInfoMap,
} from "../components/StakePlus";

type DepositLimit = {
  min: number;
  max: number;
};

export function useStakeDepositDialog() {
  return useDialog(StakeDepositDialog);
}

interface Props {
  closeDialog?: any;
  refreshPage: any;
  stakeContractInfo: StakeContractInfo;
  validatorStakingInfoMap: ValidatorStakingInfoMap;
}

function StakeDepositDialog({
  closeDialog,
  refreshPage,
  stakeContractInfo,
  validatorStakingInfoMap,
}: Props) {
  const [viewDelegate, setViewDelegate] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>("0");
  const [selectedPercentage, setSelectedPercentage] = useState("");
  const [spinner, setSpinner] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const wallet = useWallet();
  const {
    walletAddress,
    terra,
    ustBalance,
    walletBalance,
    lunaBalance,
    updateWalletBalance,
  } = useAppContext();
  const isWalletConnected: boolean = !!walletAddress && walletAddress !== "";
  // fetch this from the contract
  const [depositLimit, setDepositLimit] = useState<DepositLimit>({
    min: 0,
    max: 1000000,
  });
  const [validationMsg, setValidationMsg] = useState<string>("");
  const upperlimit = depositLimit.max;
  const walletFunds: any = walletBalance;

  const loadingMessage = spinner ? "Your transaction is in progress..." : null;

  const updateDepositAmount = useCallback((nextDepositAmount) => {
    if (ustBalance < ustFeeStakePlus) {
      setValidationMsg("Not enough UST for tx fee");
    } else if (nextDepositAmount && nextDepositAmount > lunaBalance) {
      setValidationMsg(`You cannot deposit more than ${lunaBalance}`);
    } else if (nextDepositAmount && nextDepositAmount > depositLimit.max) {
      setValidationMsg(`You cannot deposit more than ${depositLimit.max}`);
    } else if (nextDepositAmount && nextDepositAmount < depositLimit.min) {
      setValidationMsg(`You cannot deposit less than ${depositLimit.min}`);
    } else if (
      !nextDepositAmount ||
      nextDepositAmount == 0 ||
      nextDepositAmount.startsWith(".")
    ) {
      setValidationMsg("Enter a valid non zero amount");
    } else {
      setValidationMsg("");
    }

    setDepositAmount(nextDepositAmount);
  }, []);

  const closeAndRefresh = () => {
    closeDialog();
  };

  const viewDelegateContent = () => {
    setViewDelegate(true);
  };

  console.log("stakeContractInfo--->", stakeContractInfo);

  useEffect(() => {
    const getContractConfig = async () => {
      try {
        const contractConfig = await terra.wasm.contractQuery(
          stakeContractInfo.stakeContractAddress,
          {
            config: {},
          }
        );
        return contractConfig?.config;
      } catch (e) {
        console.log("Error fetching configs");
        console.log(e);
        setErrorMessage("Error fetching contract configs");
      }
    };

    getContractConfig().then((config) => {
      setDepositLimit({
        min: lunaFormatter(parseInt(config?.min_deposit)),
        max: lunaFormatter(parseInt(config?.max_deposit)),
      });
    });
  }, []);

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

      const feeInUst = ustFeeStakePlus;
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

  const confirmDepositAmount = useCallback(async (depositAmount) => {
    try {
      setSpinner(true);

      const msg = new MsgExecuteContract(
        walletAddress,
        stakeContractInfo.stakeContractAddress,
        {
          deposit: {},
        },
        { uluna: (depositAmount * LUNA_MULTIPLIER).toFixed() }
      );

      const txResult: any = await postTransaction(walletAddress, msg);

      if (!(!!txResult.result && !!txResult.result.txhash)) {
        throw Error("Failed to send transaction");
      }

      await new Promise((r) => setTimeout(r, 10000));
      await refreshPage();
      setSpinner(false);
      setSuccessMessage(`Your deposit of ${depositAmount} LUNA is successful!`);
    } catch (err: any) {
      setSpinner(false);
      setErrorMessage(toUserReadableError(err.toString()));
      setTimeout(() => setErrorMessage(""), 3000);
      throw toUserReadableError(err.toString());
    }
  }, []);

  return (
    <Modal open onClose={() => closeDialog()} className="dialog">
      <Dialog className="stake-dialog-container" onClose={() => closeDialog()}>
        <div className="stake-wrap">
          {spinner ? (
            <div className="loader-container">
              <p className="loader-text-message">
                <LoaderWhite classes={"loaderContainer"} />
                {loadingMessage}
              </p>
            </div>
          ) : successMessage ? (
            <div className="success-container">
              <div className="success-image">
                <SuccessAnimationWhite />
              </div>
              <p className="message">
                <div className="flex flex-center">
                  <div className="flex">
                    {config.network.name == "mainnet" ? (
                      <img
                        className="validatorLogo"
                        src={
                          "/static/" +
                          stakeContractInfo?.operatorAddress +
                          ".png"
                        }
                        alt=""
                      />
                    ) : (
                      <img
                        className="validatorLogo"
                        src={
                          "/static/terravaloper1t90gxaawul292g2vvqnr3g0p39tw5v6vsk5p96.png"
                        }
                        alt=""
                      />
                    )}
                  </div>
                  <div className="flex ml-2">{successMessage}</div>
                </div>
              </p>
            </div>
          ) : (
            <div className="deposit-container">
              {/*<div>
                <img src={SuccessTick} alt="Deposit Successfully Done" width={80}/>
              </div>*/}
              <div className="deposit-head">
                <p>Deposit</p>
                <p>
                  You are delegating with{" "}
                  {
                    validatorStakingInfoMap[stakeContractInfo.operatorAddress]
                      .name
                  }
                </p>
                <p>Available: {walletFunds} LUNA</p>
              </div>
              <div>
                <NumberInput
                  style={{ fontSize: 20 }}
                  className="amount"
                  value={depositAmount}
                  maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
                  maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
                  label="AMOUNT"
                  onChange={({ target }) => {
                    setSelectedPercentage("");
                    updateDepositAmount(target.value);
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
                        updateDepositAmount((0.25 * walletFunds).toFixed(6))
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
                        updateDepositAmount((0.5 * walletFunds).toFixed(6))
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
                        updateDepositAmount((0.75 * walletFunds).toFixed(6))
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
                      onClick={() => updateDepositAmount(walletFunds)}
                    >
                      Max
                    </p>
                  </div>
                </div>
                <div className="charge">
                  <p className="m-0 chargeHeader">Transaction Fee: </p>
                  <div className="chargeText">
                    <p className="m-0">{ustFeeStakePlus}</p>
                    <p className="mb-0 ms-1"> {"UST"}</p>
                  </div>
                </div>
              </div>
              <div>
                <ButtonOutlined
                  className="stake-confirm-btn"
                  onClick={() => {
                    confirmDepositAmount(depositAmount);
                  }}
                  disabled={!isWalletConnected || !!validationMsg}
                >
                  Confirm
                </ButtonOutlined>
              </div>
              {validationMsg ? (
                <p className="mt-3 text-center validation">{validationMsg}</p>
              ) : (
                <></>
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

function fetchWalletFunds(walletAddress: string) {
  throw new Error("Function not implemented.");
}
