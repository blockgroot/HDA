import {
  airdropsAPR,
  defaultAirdrops,
  GAS_PRICES_URL,
} from "@constants/constants";
import { SP_PORTFOLIO_HOLDING } from "@constants/queriesKey";
import { useAppContext } from "@libs/appContext";
import { getLunaPrice, getTokenPriceInLuna } from "@services/currency";
import {
  getKyvApr,
  getTotalFarmedRewards,
  getUserFarmedRewards,
} from "@services/rewards";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { LiquidStakingState } from "@types_/liquid-staking-pool";
import { PortfolioDataType } from "@types_/portfolio";
import { getContractByName } from "@utils/contractFilters";
import { lunaFormatter, lunaFormatterOrion } from "@utils/CurrencyHelper";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { config } from "../config/config";

export type PortfolioBreakdownType = {
  total: number;
  deposits: number;
  rewards: number;
  airdrops: {
    anc: { amount: number; amountInLuna: number };
    mir: { amount: number; amountInLuna: number };
    mine: { amount: number; amountInLuna: number };
    vkr: { amount: number; amountInLuna: number };
  };
};

const usePortfolio = () => {
  const wallet = useWallet();
  const { walletAddress, terra } = useAppContext();
  const [contractsInfo, setContractsInfo] = useState<any[]>([]);
  const [pools, setPools] = useState<any[]>([]);
  const [cfsccAirdrops, setCfsccAirdrops] = useState<any[]>([]);
  const [sccAirdrops, setSccAirdrops] = useState<any[]>([]);
  const [poolsInfo, setPoolsInfo] = useState<any[]>([]);
  const [delegatorConfig, setDelegatorConfig] = useState({});
  const [poolsUndelegations, setPoolsUndelegations] = useState<any[]>([]);
  const [rewardsUndelegations, setRewardsUndelegations] = useState<any[]>([]);
  const [portfolioBreakDown, setPortfolioBreakDown] =
    useState<PortfolioDataType>({
      total: 0,
      deposits: 0,
      total_rewards: 0,
      pending_rewards: 0,
      airdrops: {
        anc: { amount: 0, amountInLuna: 0 },
        mir: { amount: 0, amountInLuna: 0 },
        mine: { amount: 0, amountInLuna: 0 },
        vkr: { amount: 0, amountInLuna: 0 },
        orion: { amount: 0, amountInLuna: 0 },
        twd: { amount: 0, amountInLuna: 0 },
      },
    });
  const [totalKyvApr, setTotalKyvApr] = useState(0);
  const [gasPrices, setGasPrices] = useState<any>({});
  const [rewardsBreakdown, setRewardsBreakdown] = useState<any[]>([]);

  const getPoolsUndelegationInfo = async (
    contractAddress: any,
    poolId: any,
    batchId: any
  ) => {
    try {
      const undelegation = await terra.wasm.contractQuery(contractAddress, {
        batch_undelegation: { pool_id: poolId, batch_id: batchId },
      });

      return undelegation.batch;
    } catch (err) {
      console.error("Error reported in fetching contracts" + err);
    }
  };

  const getRewardsUndelegationInfo = async (
    contractAddress: any,
    strategyId: any,
    batchId: any
  ) => {
    try {
      const undelegation = await terra.wasm.contractQuery(contractAddress, {
        get_undelegation_batch_info: {
          strategy_id: strategyId,
          batch_id: batchId,
        },
      });

      return undelegation.undelegation_batch_info;
    } catch (err) {
      console.log("Error reported in fetching rewards undelegation " + err);
    }
  };

  const getContractsAndPoolDetails = async (walletAddress: string) => {
    try {
      const portfolioBreakUp = {
        total: 0,
        deposits: 0,
        total_rewards: 0,
        pending_rewards: 0,
        airdrops: {
          anc: { amount: 0, amountInLuna: 0 },
          mir: { amount: 0, amountInLuna: 0 },
          mine: { amount: 0, amountInLuna: 0 },
          vkr: { amount: 0, amountInLuna: 0 },
          orion: { amount: 0, amountInLuna: 0 },
          twd: { amount: 0, amountInLuna: 0 },
        },
      };

      let rewards: any[] = [];

      const gasPriceList = await axios.get(GAS_PRICES_URL);
      setGasPrices(gasPriceList.data);

      // const userTransactions: any = await getTransactions(walletAddress);
      const [lunaPrice, totalFarmedRewards, userFarmedRewards]: any =
        await Promise.all([
          getLunaPrice(),
          getTotalFarmedRewards(),
          getUserFarmedRewards(walletAddress),
        ]);

      const [
        ancPriceInLuna,
        mirPriceInLuna,
        minePriceInLuna,
        vkrPriceInLuna,
        orionPriceInLuna,
        twdPriceInLuna,
      ]: any = await Promise.all([
        getTokenPriceInLuna(config.contractAddresses.anc),
        getTokenPriceInLuna(config.contractAddresses.mir),
        getTokenPriceInLuna(config.contractAddresses.mine),
        getTokenPriceInLuna(config.contractAddresses.vkr),
        getTokenPriceInLuna(config.contractAddresses.orion),
        getTokenPriceInLuna(config.contractAddresses.twd),
      ]);

      if (totalFarmedRewards) {
        totalFarmedRewards.lunaPrice = lunaPrice.amount;
      }

      const contractAddress = config.contractAddresses.staderHub;
      const contracts = await terra.wasm.contractQuery(contractAddress, {
        get_all_contracts: {},
      });

      const delegatorContractAddress = getContractByName(
        contracts,
        "Delegator"
      );

      const sccContractAddress = getContractByName(contracts, "Scc");
      const cfsccContractAddress = getContractByName(contracts, "cfscc");
      const poolContractAddress = getContractByName(contracts, "Pools");

      const delegatorContractConfig = await terra.wasm.contractQuery(
        delegatorContractAddress.addr,
        {
          config: {},
        }
      );

      const [
        userInfo,
        userInfoStrategies,
        userRewardInfo,
        stateData,
        userPool0Data,
        userPool1Data,
        userPool2Data,
      ]: any = await Promise.all([
        terra.wasm.contractQuery(delegatorContractAddress.addr, {
          user: { user_addr: walletAddress },
        }),
        terra.wasm.contractQuery(sccContractAddress.addr, {
          get_user: { user: walletAddress },
        }),
        terra.wasm.contractQuery(cfsccContractAddress.addr, {
          get_user_reward_info: { user: walletAddress },
        }),
        terra.wasm.contractQuery(poolContractAddress.addr, {
          state: {},
        }),
        terra.wasm.contractQuery(poolContractAddress.addr, {
          get_user_computed_info: {
            pool_id: 0,
            user_addr: walletAddress,
          },
        }),
        terra.wasm.contractQuery(poolContractAddress.addr, {
          get_user_computed_info: {
            pool_id: 1,
            user_addr: walletAddress,
          },
        }),
        terra.wasm.contractQuery(poolContractAddress.addr, {
          get_user_computed_info: {
            pool_id: 2,
            user_addr: walletAddress,
          },
        }),
      ]);

      const poolData = await Promise.all(
        [...Array(stateData.state.next_pool_id)].map(
          async (poolId: any, index: number) => {
            const pool = await terra.wasm.contractQuery(
              poolContractAddress.addr,
              {
                pool: { pool_id: index },
              }
            );

            pool.pool.pool_id = index;
            return pool.pool;
          }
        )
      );

      const userComputedData = await Promise.all(
        [...Array(stateData.state.next_pool_id)].map(
          async (poolId: any, index: number) => {
            return await terra.wasm.contractQuery(poolContractAddress.addr, {
              get_user_computed_info: {
                pool_id: index,
                user_addr: walletAddress,
              },
            });
          }
        )
      );

      let totalDeposits = 0;
      let totalRewards = 0;

      let poolsList = poolData;
      let totalPendingRewards =
        ((userPool0Data &&
          userPool0Data.info &&
          parseInt(userPool0Data.info.pending_rewards)) ||
          0) +
        ((userPool1Data &&
          userPool1Data.info &&
          parseInt(userPool1Data.info.pending_rewards)) ||
          0) +
        ((userPool2Data &&
          userPool2Data.info &&
          parseInt(userPool2Data.info.pending_rewards)) ||
          0);

      totalRewards = totalPendingRewards;

      let totalCfsccAirdrops =
        userRewardInfo &&
        userRewardInfo.user_reward_info &&
        userRewardInfo.user_reward_info.airdrops &&
        userRewardInfo.user_reward_info.airdrops.length > 0
          ? userRewardInfo.user_reward_info.airdrops
          : defaultAirdrops;

      let totalSccAirdrops =
        userInfoStrategies &&
        userInfoStrategies.user &&
        userInfoStrategies.user.total_airdrops &&
        userInfoStrategies.user.total_airdrops.length > 0
          ? userInfoStrategies.user.total_airdrops
          : defaultAirdrops;

      let totalAirdropsValue = totalCfsccAirdrops.reduce(
        (accumulator: number, airdrop: any) => {
          portfolioBreakUp.airdrops[
            airdrop.denom as keyof typeof portfolioBreakUp.airdrops
          ].amount =
            portfolioBreakUp.airdrops[
              airdrop.denom as keyof typeof portfolioBreakUp.airdrops
            ].amount + parseInt(airdrop.amount);

          let airdropValueInLuna = parseInt(airdrop.amount);

          if (airdrop.denom === "anc") {
            airdropValueInLuna = lunaFormatter(
              airdropValueInLuna * ancPriceInLuna.amount
            );
          } else if (airdrop.denom === "mir") {
            airdropValueInLuna = lunaFormatter(
              airdropValueInLuna * mirPriceInLuna.amount
            );
          } else if (airdrop.denom === "mine") {
            airdropValueInLuna = lunaFormatter(
              airdropValueInLuna * minePriceInLuna.amount
            );
          } else if (airdrop.denom === "vkr") {
            airdropValueInLuna = lunaFormatter(
              airdropValueInLuna * vkrPriceInLuna.amount
            );
          } else if (airdrop.denom === "orion") {
            airdropValueInLuna = lunaFormatterOrion(
              airdropValueInLuna * orionPriceInLuna.amount
            );
          } else if (airdrop.denom === "twd") {
            airdropValueInLuna = lunaFormatter(
              airdropValueInLuna * twdPriceInLuna.amount
            );
          }

          portfolioBreakUp.airdrops[
            airdrop.denom as keyof typeof portfolioBreakUp.airdrops
          ].amountInLuna =
            portfolioBreakUp.airdrops[
              airdrop.denom as keyof typeof portfolioBreakUp.airdrops
            ].amountInLuna + airdropValueInLuna;

          return accumulator + airdropValueInLuna;
        },
        0
      );

      totalAirdropsValue = totalSccAirdrops.reduce(
        (accumulator: number, airdrop: any) => {
          portfolioBreakUp.airdrops[
            airdrop.denom as keyof typeof portfolioBreakUp.airdrops
          ].amount =
            portfolioBreakUp.airdrops[
              airdrop.denom as keyof typeof portfolioBreakUp.airdrops
            ].amount + parseInt(airdrop.amount);

          let airdropValueInLuna = parseInt(airdrop.amount);

          if (airdrop.denom === "anc") {
            airdropValueInLuna = lunaFormatter(
              airdropValueInLuna * ancPriceInLuna.amount
            );
          } else if (airdrop.denom === "mir") {
            airdropValueInLuna = lunaFormatter(
              airdropValueInLuna * mirPriceInLuna.amount
            );
          } else if (airdrop.denom === "mine") {
            airdropValueInLuna = lunaFormatter(
              airdropValueInLuna * minePriceInLuna.amount
            );
          } else if (airdrop.denom === "vkr") {
            airdropValueInLuna = lunaFormatter(
              airdropValueInLuna * vkrPriceInLuna.amount
            );
          } else if (airdrop.denom === "orion") {
            airdropValueInLuna = lunaFormatterOrion(
              airdropValueInLuna * orionPriceInLuna.amount
            );
          } else if (airdrop.demo === "twd") {
            airdropValueInLuna = lunaFormatter(
              airdropValueInLuna * twdPriceInLuna.amount
            );
          }

          portfolioBreakUp.airdrops[
            airdrop.denom as keyof typeof portfolioBreakUp.airdrops
          ].amountInLuna =
            portfolioBreakUp.airdrops[
              airdrop.denom as keyof typeof portfolioBreakUp.airdrops
            ].amountInLuna + airdropValueInLuna;

          return accumulator + airdropValueInLuna;
        },
        totalAirdropsValue
      );

      let totalApr = 0;
      let undelegations: any[] = [];

      for (let i = 0; i < userInfo.info.length; i++) {
        for (let j = 0; j < userInfo.info[i].undelegations.length; j++) {
          const undelegationItem = userInfo.info[i].undelegations[j];
          const undelegationInfo = await getPoolsUndelegationInfo(
            poolContractAddress.addr,
            undelegationItem.pool_id,
            undelegationItem.batch_id
          );

          const computedUndelegationAmount = await terra.wasm.contractQuery(
            delegatorContractAddress.addr,
            {
              compute_undelegation_amounts: {
                user_addr: walletAddress,
                pool_id: undelegationItem.pool_id,
                undelegate_id: undelegationItem.id,
                undelegation_slashing_pointer:
                  undelegationItem.slashing_pointer,
                batch_slashing_ratio: undelegationInfo.unbonding_slashing_ratio,
              },
            }
          );

          let pool: any = poolsList.find((poolItem: any) => {
            return poolItem.pool_id === undelegationItem.pool_id;
          });

          undelegationItem.pool_name = pool.name;
          undelegationInfo.computed_undelegation_amount = parseInt(
            computedUndelegationAmount[1]
          );

          undelegationItem.undelegationInfo = undelegationInfo;
        }

        undelegations = [...undelegations, ...userInfo.info[i].undelegations];
      }

      const undelegationRecords = await Promise.all(
        userInfoStrategies.user.undelegation_records.map(
          async (record: any) => {
            const undelegation = await getRewardsUndelegationInfo(
              sccContractAddress.addr,
              record.strategy_id,
              record.undelegation_batch_id
            );

            record.undelegationInfo = undelegation;

            return record;
          }
        )
      );

      userInfo.info.forEach(async (infoItem: any, index: number) => {
        let userComputedInfo = userComputedData.find((computedInfo: any) => {
          return (
            computedInfo &&
            computedInfo.info &&
            computedInfo.info.pool_id === infoItem.pool_id
          );
        });

        let pool: any = poolsList.find((poolItem: any) => {
          return poolItem.pool_id === infoItem.pool_id;
        });

        if (
          userComputedInfo &&
          userComputedInfo.info &&
          userComputedInfo.info.deposit.staked
        ) {
          infoItem.computed_deposit = userComputedInfo.info.deposit.staked;
          totalDeposits = totalDeposits + parseInt(infoItem.computed_deposit);
        } else {
          totalDeposits = totalDeposits + parseInt(infoItem.deposit.staked);
        }

        infoItem.pool_name = pool.name;
      });

      if (userInfo && userInfo.info && userInfo.info.length > 0) {
        const kyvData = await Promise.all(
          userInfo.info.map(async (infoItem: any, index: number) => {
            const apr: any = await getKyvApr(infoItem.pool_id);

            let poolApr =
              apr.apr * (parseInt(infoItem.deposit.staked) / totalDeposits);
            totalApr = totalApr + poolApr;
            return infoItem;
          })
        );

        totalApr = totalApr + airdropsAPR;
        setTotalKyvApr(totalApr);
      } else {
        setTotalKyvApr(0);
      }

      userInfoStrategies.user.user_strategy_info.push({
        strategy_id: 0,
        strategy_name: "RETAIN REWARDS",
        total_airdrops: [],
        total_rewards: userInfoStrategies.user.retained_rewards,
      });

      userInfoStrategies.user.user_strategy_info.forEach(
        (strategyInfo: any) => {
          totalRewards = totalRewards + parseInt(strategyInfo.total_rewards);
          rewards.push(strategyInfo);
        }
      );

      portfolioBreakUp.deposits = totalDeposits;

      // TODO - GM. Do we need to add airdrops value?
      portfolioBreakUp.total = totalDeposits + totalRewards; //+ totalAirdropsValue;
      portfolioBreakUp.deposits = totalDeposits;
      portfolioBreakUp.total_rewards = totalRewards;
      portfolioBreakUp.pending_rewards = totalPendingRewards;

      setDelegatorConfig(delegatorContractConfig.config);
      // setTransactions(userTransactions);
      setContractsInfo(contracts);
      setPools(poolsList);
      setPortfolioBreakDown(portfolioBreakUp);
      setPoolsInfo(userInfo.info);
      setCfsccAirdrops(totalCfsccAirdrops);
      setSccAirdrops(totalSccAirdrops);
      setRewardsBreakdown(rewards);
      setPoolsUndelegations(undelegations);
      setRewardsUndelegations(undelegationRecords);
      // setSpinner(false);
      return { success: true, message: "Successful" };
    } catch (err) {
      console.error("Error reported in fetching contracts" + err);
    }
  };

  const queryClient = useQueryClient();
  const { refetch, isLoading, isFetching } = useQuery(
    [SP_PORTFOLIO_HOLDING, walletAddress],
    () => getContractsAndPoolDetails(walletAddress),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (walletAddress) {
      refetch();
      // getContractsAndPoolDetails(walletAddress);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (wallet.status === WalletStatus.WALLET_NOT_CONNECTED && !walletAddress) {
      queryClient.cancelQueries([SP_PORTFOLIO_HOLDING, walletAddress]);
    }
  }, [wallet.status]); ////

  return {
    rewards: rewardsBreakdown,
    totalKyvApr,
    portfolioBreakDown,
    pools,
    poolsInfo,
    contractsInfo,
    gasPrices,
    delegatorConfig,
    poolsUndelegations,
    isLoading,
    cfsccAirdrops,
    sccAirdrops,
    rewardsUndelegations,
  };
};

export default usePortfolio;
