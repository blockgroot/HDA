import { PortfolioDataType } from "@types_/portfolio";
import PortfolioMHAirdrops from "@organisms/PortfolioMHAirdrops/PortfolioMHAirdrops";
import PortfolioMHReward from "@organisms/PortfolioMHRewards/PortfolioMHRewards";
import PortfolioMHDeposits from "@organisms/PortfolioMHDeposits/PortfolioMHDeposits";
import SPPortfolioMHWithdrawal from "@organisms/SPPortfolioMHWithdrawal/SPPortfolioMHWithdrawal";
import { LiquidStakingState } from "@types_/liquid-staking-pool";
import styles from "./SPPortfolioManageHolding.module.scss";

interface Props {
  portfolioData: PortfolioDataType;
  contracts: any;
  poolsInfo: any;
  poolsUndelegations: any;
  delegatorConfig: any;
  gasPrices: any;
  rewards: any[];
  cfsccAirdrops: any;
  sccAirdrops: any;
  rewardsUndelegations: any;
}

export default function SPPortfolioManageHolding(props: Props) {
  const {
    portfolioData,
    poolsInfo,
    poolsUndelegations,
    contracts,
    delegatorConfig,
    gasPrices,
    rewards,
    cfsccAirdrops,
    sccAirdrops,
    rewardsUndelegations,
  } = props;
  const { airdrops } = portfolioData;
  return (
    <div className={styles.container}>
      <div>
        <PortfolioMHAirdrops
          contracts={contracts}
          airdrops={airdrops}
          cfsccAirdrops={cfsccAirdrops}
          sccAirdrops={sccAirdrops}
        />
      </div>
      <div>
        <PortfolioMHReward
          rewards={rewards}
          contracts={contracts}
          gasPrices={gasPrices}
        />
      </div>
      <div>
        <PortfolioMHDeposits
          poolsInfo={poolsInfo}
          poolsUndelegations={poolsUndelegations}
          contracts={contracts}
          delegatorConfig={delegatorConfig}
          gasPrices={gasPrices}
        />
      </div>
      <div>
        <SPPortfolioMHWithdrawal
          gasPrices={gasPrices}
          poolsUndelegations={poolsUndelegations}
          contracts={contracts}
          delegatorConfig={delegatorConfig}
          rewardsUndelegations={rewardsUndelegations}
        />
      </div>
    </div>
  );
}
