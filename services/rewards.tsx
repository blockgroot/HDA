import {
  GET_TOTAL_FARMED_REWARDS,
  GET_USER_FARMED_REWARDS,
  GET_KVY_APR_BY_POOL,
  GET_USER_STAKING_REWARDS,
  GET_USER_STAKING_AIRDROPS,
  GET_USER_SD_REWARDS,
} from "../constants/constants";
import request from "./client";
import requestLiquidStaking from "./clientLiquidStaking";
import { MySDRewardsType } from "../hooks/usePortfolioCFRewards";
import { PortfolioSDPriceTotalType } from "../@types/portfolio";

export const getTotalFarmedRewards =
  async (): Promise<PortfolioSDPriceTotalType> => {
    let authParams = {
      url: GET_TOTAL_FARMED_REWARDS,
    };

    const response: any = await request("post", authParams);
    return response.data;
  };

export const getUserFarmedRewards = async (
  walletAddress: string
): Promise<MySDRewardsType> => {
  const authParams = {
    url: GET_USER_FARMED_REWARDS,
    data: {
      userAddress: walletAddress,
    },
  };

  const response: any = await request("post", authParams);
  return response.data;
};

export const getKyvApr = async (poolId: number) => {
  const authParams = {
    url: GET_KVY_APR_BY_POOL,
    data: {
      poolId,
    },
  };

  const response = await request("post", authParams);
  return response.data;
};

export const getUserStakingRewards = async (walletAddress: string) => {
  const authParams = {
    url: GET_USER_STAKING_REWARDS,
    data: {
      userAddress: walletAddress,
    },
  };

  const response = await request("post", authParams);
  return response.data;
};

export const getUserStakingAirdrops = async (walletAddress: string) => {
  const authParams = {
    url: GET_USER_STAKING_AIRDROPS,
    data: {
      userAddress: walletAddress,
    },
  };

  const response = await request("post", authParams);
  return response.data;
};

export const getUserSdRewards = async (walletAddress: string) => {
  const authParams = {
    url: GET_USER_SD_REWARDS,
    data: {
      userAddress: walletAddress,
    },
  };

  const response = await requestLiquidStaking("post", authParams);
  return response.data;
};
