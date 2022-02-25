import React, { useCallback, useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { useWallet } from "@terra-money/wallet-provider";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";

import styles from "./SPStrategies.module.scss";

import InfoIcon from "@material-ui/icons/Info";

import { config } from "../../../config/config";

import ArrowRight from "../../assets/svg/arrow_right.svg";
import PercentageIcon from "../../assets/svg/percentage.svg";
import BoltIcon from "../../assets/svg/bolt.svg";
import { messageMemo, ustFeeStrategies } from "@constants/constants";
import { getContractByName } from "@utils/contractFilters";
import { toUserReadableError } from "@utils/ErrorHelper";
import { useSuccessDialog } from "../../../dialogs/useSuccessDialog";
import { Box, Breadcrumbs, Loader, Typography } from "../../atoms";
import StrategyItem from "@organisms/StrategyItem/StrategyItem";
import { ButtonOutlined } from "@atoms/Button/Button";
import { useAppContext } from "@libs/appContext";
import { useQuery } from "react-query";
import { SP_STRATEGIES_CONTRACTS_AND_POOLS } from "@constants/queriesKey";

function StrategiesPage() {
  const { terra, walletAddress } = useAppContext();
  const wallet = useWallet();

  const [spinner, setSpinner] = useState(true);
  const [canChangePortfolio, setCanChangePortfolio] = useState(false);
  const [userPortfolio, setUserPortfolio] = useState([
    { strategy_id: 0, deposit_fraction: "0" },
    { strategy_id: 1, deposit_fraction: "100" },
  ]);
  const [autoCompoundingDepositFraction, setAutoCompoundingDepositFraction] =
    useState(100);
  const [retainRewardsDepositFraction, setRetainRewardsDepositFraction] =
    useState(0);

  const [errMsg, setErrMsg] = useState("");

  const [openSuccessDialog, successDialogElement] = useSuccessDialog();

  function setErrorMsgForFailure(
    errorMessage = "Something did not go right. Please try again!",
    timeout = 5000
  ) {
    setErrMsg(errorMessage);
    setTimeout(() => {
      setErrMsg("");
    }, timeout);
  }

  const getContractsAndPoolDetails = async (walletAddress: string) => {
    try {
      const contractAddress = config.contractAddresses.staderHub;
      const contracts = await terra.wasm.contractQuery(contractAddress, {
        get_all_contracts: {},
      });

      const sccAddress = getContractByName(contracts, "scc");

      const userInfo = await terra.wasm.contractQuery(sccAddress.addr, {
        get_user: { user: walletAddress },
      });

      if (
        userInfo.user.user_portfolio &&
        userInfo.user.user_portfolio.length > 0
      ) {
        setUserPortfolio(userInfo.user.user_portfolio);
        userInfo.user.user_portfolio.forEach((strategy: any) => {
          if (strategy.strategy_id === 0) {
            setRetainRewardsDepositFraction(
              parseInt(strategy.deposit_fraction)
            );
          } else if (strategy.strategy_id === 1) {
            setAutoCompoundingDepositFraction(
              parseInt(strategy.deposit_fraction)
            );
          }
        });
      }

      return contracts;
      // setContractsInfo(contracts);
      // setSpinner(false);
    } catch (err) {
      console.log("Error reported in fetching contracts" + err);
      setSpinner(false);
    }
  };

  const { data, refetch, isLoading } = useQuery(
    [SP_STRATEGIES_CONTRACTS_AND_POOLS, walletAddress],
    () => getContractsAndPoolDetails(walletAddress)
  );

  const refreshPage = () => {
    setSpinner(true);
    setCanChangePortfolio(false);
    setTimeout(() => {
      refetch();
    }, 5000);
    // getContractsAndPoolDetails(primaryWalletAddress);
  };

  if (isLoading) {
    return <Loader />;
  }
  const updateUserPortfolio = async (walletAddress: string) => {
    const contractAddress = getContractByName(data, "scc");

    const msg = new MsgExecuteContract(walletAddress, contractAddress.addr, {
      update_user_portfolio: {
        user_portfolio: userPortfolio,
      },
    });

    try {
      let fee = await (terra && terra.tx.estimateFee(walletAddress, [msg]));

      const tx = await wallet.post({
        msgs: [msg],
        fee: new StdFee(
          fee.gas,
          `${(ustFeeStrategies * 1000000).toFixed()}uusd`
        ),
        memo: messageMemo,
      });

      if (!(!!tx.result && !!tx.result.txhash)) {
        throw Error("Failed to send transaction");
      } else {
        openSuccessDialog({
          refreshPage,
          autoCompoundingDepositFraction,
          retainRewardsDepositFraction,
        });
      }
    } catch (err: any) {
      console.log("Exception Thrown|" + err.toString());
      setErrorMsgForFailure(toUserReadableError(err.toString()));
    }
  };

  const updateDepositFraction = (value: number, strategyId: number) => {
    let autoCompoundingFraction = 0;
    let retainRewardsFraction = 0;

    if (strategyId === 0) {
      retainRewardsFraction = value;
      autoCompoundingFraction = 100 - value;
    } else {
      retainRewardsFraction = 100 - value;
      autoCompoundingFraction = value;
    }

    const userPortfolio = [
      {
        strategy_id: 0,
        deposit_fraction: retainRewardsFraction.toString(),
      },
      {
        strategy_id: 1,
        deposit_fraction: autoCompoundingFraction.toString(),
      },
    ];

    setUserPortfolio(userPortfolio);
    setAutoCompoundingDepositFraction(autoCompoundingFraction);
    setRetainRewardsDepositFraction(retainRewardsFraction);
  };

  const breadcrumbsContent = [
    <Typography color="textSecondary">Stake Pools</Typography>,
    <Typography>Strategies</Typography>,
  ];

  return (
    <div className={styles.container} style={{ flexGrow: 1 }}>
      <div>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs>{breadcrumbsContent}</Breadcrumbs>
        </div>
        <div className={styles.info_container}>
          <InfoIcon className="text-white mr-2" />
          <Typography fontWeight={"semi-bold"}>
            Reward strategy you select is applied for future rewards across all
            your pools.
          </Typography>
        </div>
        <div className={styles.grid_container}>
          <Box className={styles.box}>
            <div className={"mb-6"}>
              <StrategyItem
                shouldSlide={canChangePortfolio}
                value={autoCompoundingDepositFraction}
                title={"Auto Compound Rewards"}
                description={
                  "Stable coin rewards converted to Luna & All Luna rewards restaked."
                }
                onChange={(event, value) => {
                  updateDepositFraction(value as number, 1);
                }}
                thumbClassName={styles.auto_compounding_thumb}
                trackClassName={styles.auto_compounding_track}
                logo={PercentageIcon}
              />
            </div>

            <StrategyItem
              shouldSlide={canChangePortfolio}
              value={retainRewardsDepositFraction}
              title={"Retain Rewards"}
              description={"Instant Rewards Withdrawal"}
              onChange={(event, value) => {
                updateDepositFraction(value as number, 0);
              }}
              thumbClassName={styles.retain_reward_thumb}
              trackClassName={styles.retain_reward_track}
              logo={BoltIcon}
            />
            {canChangePortfolio ? (
              <Typography variant={"body3"} className="mt-2 mb-4 text-center">
                Transaction fee of 0.2 UST will be charged to change Strategy
              </Typography>
            ) : null}
            <div className="text-center flex items-center justify-center">
              {canChangePortfolio ? (
                <ButtonOutlined
                  onClick={() => {
                    updateUserPortfolio(walletAddress);
                  }}
                  size={"large"}
                >
                  Confirm
                </ButtonOutlined>
              ) : (
                <div
                  className="flex items-center justify-center cursor-pointer"
                  onClick={() => setCanChangePortfolio(true)}
                >
                  <Typography variant={"body1"} fontWeight={"bold"}>
                    Change Strategy
                  </Typography>
                  <img src={ArrowRight} alt="icon" className={"ml-4"} />
                </div>
              )}
            </div>
          </Box>
        </div>
      </div>

      {successDialogElement}
    </div>
  );
}

export default StrategiesPage;
