import { useEffect, useState } from "react";
import { getUserSdRewards } from "../services/rewards";
import { useAppContext } from "../libs/appContext";
import { FarmedReward } from "../@types/liquid-staking-reward";
import { useQuery } from "react-query";

export default function useLiquidStakingRewards() {
  const { walletAddress } = useAppContext();

  const [farmedReward, setFarmedReward] = useState<FarmedReward>({
    totalSdTokens: 0,
    totalRewards: 0,
  });

  const { refetch, isLoading } = useQuery(
    ["farmed-reward", walletAddress],
    () => getUserSdRewards(walletAddress),
    {
      enabled: false,
      onSuccess: (res: FarmedReward) => {
        setFarmedReward(res);
      },
    }
  );

  useEffect(() => {
    if (walletAddress) {
      refetch();
    }
  }, [walletAddress]);

  return { farmedReward, isLoading };
}
