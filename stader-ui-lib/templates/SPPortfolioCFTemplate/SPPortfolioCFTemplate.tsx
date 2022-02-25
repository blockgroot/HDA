import PortfolioMySDToken from "../../organisms/PortfolioMySDToken/PortfolioMySDToken";
import usePortfolioCFRewards from "../../../hooks/usePortfolioCFRewards";
import SdRewardsVesting from "@molecules/SdRewardsVesting/SdRewardsVesting";
import { Grid } from "@material-ui/core";

export default function SPPortfolioCFTemplate() {
  const { userInfo, userInfoLoading } = usePortfolioCFRewards();

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item md={8}>
          <SdRewardsVesting />
        </Grid>
        <Grid item xs={12} md={4} className="md:mt-12">
          <PortfolioMySDToken userInfo={userInfo} isLoading={userInfoLoading} />
        </Grid>
      </Grid>
    </div>
  );
}
