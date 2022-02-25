import { useEffect, useState } from "react";
import {
  getTotalFarmedRewards,
  getUserFarmedRewards,
} from "../services/rewards";
import { useQuery } from "react-query";
import { useAppContext } from "../libs/appContext";
import { PortfolioSDPriceTotalType } from "../@types/portfolio";

export type MySDRewardsType = {
  totalSdTokens: number;
  totalRewards: number;
  deltaInSdTokens?: number;
  deltaInRewards?: number;
};

const usePortfolioCFRewards = () => {
  const { walletAddress } = useAppContext();

  const [userInfo, setUserInfo] = useState<MySDRewardsType>({
    totalSdTokens: 0,
    totalRewards: 0,
  });

  const [sdPriceTotal, setSDPriceTotal] = useState<PortfolioSDPriceTotalType>({
    sdTokenPrice: 0,
    totalSdTokens: 0,
  });

  const userQuery = useQuery(
    ["user-cf-reward", walletAddress],
    () => getUserFarmedRewards(walletAddress),
    {
      enabled: false,
      onSuccess: (res: MySDRewardsType) => {
        const { totalSdTokens, totalRewards } = res;
        setUserInfo({ totalSdTokens, totalRewards });
      },
    }
  );

  const totalQuery = useQuery("cf-price-total", getTotalFarmedRewards, {
    enabled: false,
    onSuccess: (res: PortfolioSDPriceTotalType) => {
      const { totalSdTokens, sdTokenPrice } = res;
      setSDPriceTotal({ sdTokenPrice, totalSdTokens });
    },
  });

  useEffect(() => {
    if (walletAddress) {
      userQuery.refetch();
      totalQuery.refetch();
    }
  }, [walletAddress]);

  return {
    userInfo,
    userInfoLoading: userQuery.isLoading,
    sdPriceTotal,
    sdPriceTotalLoading: totalQuery.isLoading,
  };
};

export default usePortfolioCFRewards;
