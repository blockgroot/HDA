import React, { useEffect, useState } from "react";
import axios from "axios";

import { config } from "../config/config";
import { airdropsAPR } from "@constants/constants";
import {
  getContractByName,
  getValidatorByAddress,
} from "@utils/contractFilters";
import { getKyvApr } from "@services/rewards";
import { useAppContext } from "@libs/appContext";
import { useQuery } from "react-query";
import { PoolsAndContractsType } from "@types_/stake-pools";
import { CONTRACTS_AND_POOLS } from "@constants/queriesKey";

function useCommunityFarmingPools() {
  const { walletAddress, terra } = useAppContext();
  const [pools, setPools] = useState<any[]>([]);

  const [contractsInfo, setContractsInfo] = useState<any[]>([]);

  const handleContractsAndPoolDetails = async (
    walletAddress: string
  ): Promise<PoolsAndContractsType> => {
    try {
      const contractAddress = config.contractAddresses.staderHub;
      const tvlRewardsInfo = {
        tvlRewards: 0,
        tvlRewardsInUSD: 0,
      };
      const contracts = await terra.wasm.contractQuery(contractAddress, {
        get_all_contracts: {},
      });

      const validatorsData = await axios.get(config.VALIDATORS_URL);

      const delegatorContractAddress = getContractByName(
        contracts,
        "Delegator"
      );

      const poolsContractAddress = getContractByName(contracts, "Pools");

      let userPoolsInfo: { pools: any } = {
        pools: [],
      };

      let stateData = await terra.wasm.contractQuery(
        poolsContractAddress.addr,
        {
          state: {},
        }
      );

      userPoolsInfo.pools = await Promise.all(
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

            tvlRewardsInfo.tvlRewards =
              tvlRewardsInfo.tvlRewards + parseInt(pool.pool.staked);
            return pool.pool;
          }
        )
      );

      let userInfo = await terra.wasm.contractQuery(
        delegatorContractAddress.addr,
        {
          user: { user_addr: walletAddress },
        }
      );

      let poolsConfig = await terra.wasm.contractQuery(
        poolsContractAddress.addr,
        {
          config: {},
        }
      );

      if (userPoolsInfo && userPoolsInfo.pools.length > 0) {
        userPoolsInfo.pools = userPoolsInfo.pools.map((pool: any) => {
          pool.validators = pool.validators.map((validator: string) => {
            const validatorInfo = getValidatorByAddress(
              validatorsData.data,
              validator
            );
            return validatorInfo;
          });

          return pool;
        });
      }

      userInfo.info.forEach((userDetails: any) => {
        userPoolsInfo.pools[userDetails.pool_id].pool_id = userDetails.pool_id;
        userPoolsInfo.pools[userDetails.pool_id].deposit =
          userDetails.deposit.staked;
        userPoolsInfo.pools[userDetails.pool_id].rewards =
          userDetails.pending_rewards;
        userPoolsInfo.pools[userDetails.pool_id].undelegations =
          userDetails.undelegations;
        userPoolsInfo.pools[userDetails.pool_id].airdrops =
          userDetails.pending_airdrops;
      });

      userPoolsInfo.pools.forEach((poolDetails: any, index: number) => {
        poolDetails.pool_id = poolDetails.pool_id ? poolDetails.pool_id : index;
        poolDetails.deposit = poolDetails.deposit ? poolDetails.deposit : 0;
        poolDetails.maxDepositAmount = parseInt(poolsConfig.config.max_deposit);
        poolDetails.minDepositAmount = parseInt(poolsConfig.config.min_deposit);
      });

      return { pools: userPoolsInfo.pools, contracts: contracts };
    } catch (err: any) {
      console.log("Error reported in fetching contracts" + err);
      return err;
    }
  };

  const { refetch, isLoading } = useQuery<PoolsAndContractsType, any>(
    [CONTRACTS_AND_POOLS, walletAddress],
    () => handleContractsAndPoolDetails(walletAddress),
    {
      onSuccess: (res: { pools: Array<any>; contracts: any }) => {
        const { pools, contracts } = res;
        setPools(pools);
        setContractsInfo(contracts);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  useEffect(() => {
    if (walletAddress) {
      refetch();
      // (async () => await handleContractsAndPoolDetails())();
    }
  }, [walletAddress]);

  return { pools, poolsLoading: isLoading, contractsInfo };
}

export default useCommunityFarmingPools;
