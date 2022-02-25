import PortfolioMyHoldingChart from "@molecules/PortfolioMyHoldingChart/PortfolioMyHoldingChart";
import PortfolioDepositRewards from "@molecules/PortfolioDepositRewards/PortfolioDepositRewards";
import { Box } from "../../atoms";
import { PortfolioDataType } from "@types_/portfolio";
import styles from "./PortfolioRewardChart.module.scss";

type Props = {
  portfolioBreakDown: PortfolioDataType;
};

const PortfolioRewardChart = (props: Props) => {
  const { portfolioBreakDown } = props;
  return (
    <Box noPadding className={styles.root}>
      <PortfolioMyHoldingChart portfolioBreakDown={portfolioBreakDown} />
      <PortfolioDepositRewards portfolioBreakDown={portfolioBreakDown} />
    </Box>
  );
};

export default PortfolioRewardChart;
