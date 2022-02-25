import { Grid } from "@material-ui/core";
import PortfolioCFTotalHolding from "@molecules/PortfolioCFTotalHolding/PortfolioCFTotalHolding";
import PortfolioRewardChart from "@organisms/PortfolioRewardChart/PortfolioRewardChart";
import { PortfolioDataType } from "@types_/portfolio";
import styles from "./PortfolioMyHolding.module.scss";

interface Props {
  totalKyvApr: number;
  portfolioBreakDown: PortfolioDataType;
}

export default function PortfolioMyHolding(props: Props) {
  const { totalKyvApr, portfolioBreakDown } = props;
  return (
    <div className={styles.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <PortfolioCFTotalHolding
            totalHolding={portfolioBreakDown.total}
            totalKyvApr={totalKyvApr}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <PortfolioRewardChart portfolioBreakDown={portfolioBreakDown} />
        </Grid>
      </Grid>
    </div>
  );
}
