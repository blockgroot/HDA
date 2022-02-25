import LSRewardCF from "../../organisms/LSRewardCF/LSRewardCF";
import useLiquidStakingRewards from "../../../hooks/useLiquidStakingRewards";
import LQRewardSDTokenPriceTotal from "../../organisms/LQRewardSDTokenPriceTotal/LQRewardSDTokenPriceTotal";
import { Typography } from "../../atoms";
import AirdropsWithdraw from "../../molecules/AirdropsWithdraw/AirdropsWithdraw";
import useAirdrops from "../../../hooks/useAirdrops";
import SdRewardsVesting from "@molecules/SdRewardsVesting/SdRewardsVesting";
import { Grid, Hidden } from "@material-ui/core";

export default function LSRewards() {
  const liquidStakingRewards = useLiquidStakingRewards();
  const { airdrops, isLoading } = useAirdrops();

  return (
    <div className="w-full">
      <Typography variant={"h3"} fontWeight={"bold"} className={"mb-4"}>
        Community Farming
      </Typography>
      <Grid container spacing={4} className={"mb-4"}>
        <Grid item xs={12} md={5}>
          <LSRewardCF
            farmedReward={liquidStakingRewards.farmedReward}
            isLoading={liquidStakingRewards.isLoading}
          />
        </Grid>
        <Hidden smDown>
          <Grid item xs={1} md={7}>
            {/* <LQRewardSDTokenPriceTotal /> */}
          </Grid>
        </Hidden>
      </Grid>

      <Typography variant={"h3"} fontWeight={"bold"} className={"my-3"}>
        Airdrops
      </Typography>
      <AirdropsWithdraw airdrops={airdrops} isLoading={isLoading} />
      <div className={"mt-12"}>
        <SdRewardsVesting isLiquidStaking={true} />
      </div>
    </div>
  );
}
