import { ustFee } from "@constants/constants";
import { useDialog } from "@terra-dev/use-dialog";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import React, { useCallback, useState } from "react";
import arrowBack from "../assets/svg/arrow_back.svg";
import SuccessAnimation from "../components/common/SuccessAnimation";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { toUserReadableError } from "@utils/ErrorHelper";
import { useAppContext } from "@libs/appContext";
import { ButtonOutlined } from "@atoms/Button/Button";
import SuccessAnimationWhite from "../components/common/SuccessAnimationWhite";
import LoaderWhite from "../components/common/LoaderWhite";

interface Props {
  closeDialog?: any;
  refreshPage?: any;
  goBack: any;
  validatorAirdropInfo: any;
  walletAddress: any;
  terra: any;
  wallet: any;
}

export function useStakePlusAirdropsWithdrawDialog() {
  return useDialog(StakeAirdropWithdrawDialog);
}

function StakeAirdropWithdrawDialog({
  closeDialog,
  refreshPage,
  goBack,
  validatorAirdropInfo,
  walletAddress,
  terra,
  wallet,
}: Props) {
  const closeAndRefresh = () => {
    closeDialog();
  };
  const [spinner, setSpinner] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { ustBalance } = useAppContext();
  const isWalletConnected: boolean = !!walletAddress && walletAddress !== "";
  const loadingMessage = spinner ? "Airdrops are being withdrawn..." : null;

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

  const withdrawAirdrops = useCallback(async () => {
    try {
      setSpinner(true);
      const msg = new MsgExecuteContract(
        walletAddress,
        validatorAirdropInfo?.validatorInfo?.contract_address,
        {
          withdraw_airdrops: {},
        }
      );

      const txResult: any = await postTransaction(walletAddress, msg);

      if (!(!!txResult.result && !!txResult.result.txhash)) {
        throw Error("Failed to send transaction");
      }

      // sleep for sometime to allow the tx to settle
      await new Promise((r) => setTimeout(r, 10000));
      await refreshPage();

      setSuccessMessage(`Your withdraw is successful!`);
      setSpinner(false);
    } catch (err: any) {
      // Could not even locate keys or type for this err. Relying on a hack.
      setSpinner(false);
      setSuccessMessage("");
      setErrorMessage(toUserReadableError(err.toString()));
      setTimeout(() => setErrorMessage(""), 3000);
      throw toUserReadableError(err.toString());
    }
  }, []);

  return (
    <div className="stake-wrap">
      {!spinner && !successMessage ? (
        <div className="withdraw-container">
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
          <div className="withdraw-head">
            <p>Withdraw Airdrops</p>
            <p>
              You are withdrawing from{" "}
              <span>{validatorAirdropInfo?.validatorInfo.validator_name}</span>
            </p>
          </div>
          <div className="airdrop-withdraw-grid">
            <div className="flex items-center">
              <h2 className="font-normal text-white">
                {validatorAirdropInfo?.airdrops?.anc}
              </h2>
              <div className="ml-2 mr-1">
                <p className="font-normal text-white">ANC</p>
              </div>
              <img
                src="/static/anc.png"
                alt="ANC"
                height={12}
                style={{ marginLeft: 8 }}
                className="legendImage"
              />
            </div>
            <div className="flex items-center">
              <h2 className="font-normal text-white">
                {validatorAirdropInfo?.airdrops?.mir}
              </h2>
              <div className="ml-2 mr-1">
                <p className="font-normal text-white">MIR</p>
              </div>
              <img
                src="/static/mir.png"
                alt="MIR"
                height={12}
                style={{ marginLeft: 8 }}
                className="legendImage"
              />
            </div>
            <div className="flex items-center">
              <h2 className="font-normal text-white">
                {validatorAirdropInfo?.airdrops?.vkr}
              </h2>
              <div className="ml-2 mr-1">
                <p className="font-normal text-white">VKR</p>
              </div>
              <img
                src="/static/valkyrie.png"
                alt="VKR"
                height={12}
                style={{ marginLeft: 8 }}
                className="legendImage"
              />
            </div>
            <div className="flex items-center">
              <h2 className="font-normal text-white">
                {validatorAirdropInfo?.airdrops?.mine}
              </h2>
              <div className="ml-2 mr-1">
                <p className="font-normal text-white">MINE</p>
              </div>
              <img
                src="/static/pylon.png"
                alt="MINE"
                height={12}
                style={{ marginLeft: 8 }}
                className="legendImage"
              />
            </div>
            <div className="flex items-center">
              <h2 className="font-normal text-white">
                {validatorAirdropInfo?.airdrops?.orion}
              </h2>
              <div className="ml-2 mr-1">
                <p className="font-normal text-white">ORION</p>
              </div>
              <img
                src="/static/orion.png"
                alt="ORION"
                height={12}
                style={{ marginLeft: 8 }}
                className="legendImage"
              />
            </div>
            <div className="flex items-center">
              <h2 className="font-normal text-white">
                {validatorAirdropInfo?.airdrops?.twd}
              </h2>
              <div className="ml-2 mr-1">
                <p className="font-normal text-white">TWD</p>
              </div>
              <img
                src="/static/twd.png"
                alt="TWD"
                height={12}
                style={{ marginLeft: 8 }}
                className="legendImage"
              />
            </div>
          </div>
          <div className="withdraw-footer">
            <p>Airdrops withdrawn will go to your wallet</p>
            <p>Transaction Fee: {ustFee} UST</p>
          </div>
          <div>
            <ButtonOutlined
              className="stake-confirm-btn"
              disabled={ustBalance < ustFee}
              onClick={() => {
                withdrawAirdrops();
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
      ) : (
        <div>
          {!successMessage ? (
            <div className="loader-container">
              <p className="loader-text-message">
                <LoaderWhite classes={"loaderContainer"} />
                {loadingMessage}
              </p>
            </div>
          ) : (
            <div className="success-container">
              <div className="success-image">
                <SuccessAnimationWhite />
              </div>
              <p className="message">{successMessage}</p>
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
  );
}
