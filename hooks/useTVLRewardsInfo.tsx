import React, { useEffect, useState } from "react";
import { config } from "../config/config";
import { airdropsAPR } from "../constants/constants";

import { nativeTokenFormatter } from "../utils/CurrencyHelper";
import { getContractByName } from "../utils/contractFilters";
import { getNativeTokenPrice } from "../services/currency";
import { getKyvApr } from "../services/rewards";
import { useAppContext } from "../libs/appContext";
import useWalletInfo from "./useWalletInfo";
import { useQuery } from "react-query";

const useTVLRewardsInfo = () => {
  const { terra } = useAppContext();
  const { walletAddress } = useWalletInfo();

  const [tvlRewards, setTvlRewards] = useState<number>(0);

  const getContractsAndPoolDetails = async (walletAddress: string) => {
    try {
      const contractAddress = config.contractAddresses.staderHub;
      const tvlRewardsInfo = {
        tvlRewards: 0,
        tvlRewardsInUSD: 0,
      };
      let tvlRewards = 0;
      const contracts = await terra.wasm.contractQuery(contractAddress, {
        get_all_contracts: {},
      });

      const nativeTokenPrice: any = await getNativeTokenPrice();

      const poolsContractAddress = getContractByName(contracts, "Pools");

      let stateData = await terra.wasm.contractQuery(
        poolsContractAddress.addr,
        {
          state: {},
        }
      );

      await Promise.all(
        [...Array(stateData.state.next_pool_id)].map(
          async (poolId: any, index: number) => {
            const pool = await terra.wasm.contractQuery(
              poolsContractAddress.addr,
              {
                pool: { pool_id: index },
              }
            );

            const kyvApr: any = await getKyvApr(index);
            pool.pool.computedApr =
              kyvApr.apr && kyvApr.apr > 0
                ? parseFloat(kyvApr.apr + airdropsAPR).toFixed(2)
                : 0;

            let userComputedInfo = await terra.wasm.contractQuery(
              poolsContractAddress.addr,
              {
                get_user_computed_info: {
                  pool_id: index,
                  user_addr: walletAddress,
                },
              }
            );

            if (userComputedInfo.info && userComputedInfo.info.deposit) {
              pool.pool.computed_deposit = userComputedInfo.info.deposit.staked;
            }
            tvlRewards = tvlRewards + parseInt(pool.pool.staked);
            tvlRewardsInfo.tvlRewards =
              tvlRewardsInfo.tvlRewards + parseInt(pool.pool.staked);
            return pool.pool;
          }
        )
      );
      tvlRewards = Math.round(nativeTokenFormatter(tvlRewards));
      tvlRewardsInfo.tvlRewards = Math.round(
        nativeTokenFormatter(tvlRewardsInfo.tvlRewards)
      );

      return tvlRewardsInfo.tvlRewards;
    } catch (err) {
      throw new Error("Error reported in fetching contracts" + err);
    }
  };

  const { refetch, isLoading } = useQuery(
    ["tvl-rewards-info", walletAddress],
    () => getContractsAndPoolDetails(walletAddress),
    {
      enabled: false,
      onSuccess: (res: any) => {
        setTvlRewards(res);
      },
      onError: (err) => {
        // console.log(err);
      },
    }
  );
  useEffect(() => {
    if (walletAddress) {
      refetch();
    }

    // (async () => {
    //   await getContractsAndPoolDetails();
    // })();
  }, [walletAddress]);
  return { tvlRewards, isLoading };
};

export default useTVLRewardsInfo;
