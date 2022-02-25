import { Loader } from "@atoms/index";
import { useAppContext } from "@libs/appContext";
import SPPortfolioManageHolding from "@templates/SPPortfolioManageHolding/SPPortfolioManageHolding";
import React, { useState } from "react";
import usePortfolio from "../hooks/usePortfolio";
import MainLayout from "../layout";
import SPPortfolioTabsHead, {
  PortfolioTabValues,
} from "../stader-ui-lib/molecules/SPPortfolioTabsHead/SPPortfolioTabsHead";
import PortfolioMyHolding from "../stader-ui-lib/templates/PortfolioMyHolding/PorfolioMyHolding";
import SPPortfolioCFTemplate from "../stader-ui-lib/templates/SPPortfolioCFTemplate/SPPortfolioCFTemplate";

function Portfolio() {
  const { lunaBalance } = useAppContext();
  const {
    rewards,
    totalKyvApr,
    portfolioBreakDown,
    poolsInfo,
    gasPrices,
    contractsInfo,
    delegatorConfig,
    poolsUndelegations,
    isLoading,
    cfsccAirdrops,
    sccAirdrops,
    rewardsUndelegations,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<PortfolioTabValues>(
    PortfolioTabValues.MY_HOLDINGS
  );
  const handleTabChange = (val: PortfolioTabValues) => {
    setActiveTab(val);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Loader text={"Please wait while we set things up for you"} />
      </MainLayout>
    );
  }

  return (
    <div>
      <MainLayout>
        <div>
          <SPPortfolioTabsHead
            activeTab={activeTab}
            onClick={handleTabChange}
          />
          <div className={"py-8 mt-3"}>
            {activeTab === PortfolioTabValues.COMMUNITY_FARMING && (
              <SPPortfolioCFTemplate />
            )}
            {activeTab === PortfolioTabValues.MY_HOLDINGS && (
              <PortfolioMyHolding
                totalKyvApr={totalKyvApr}
                portfolioBreakDown={portfolioBreakDown}
              />
            )}
            {activeTab === PortfolioTabValues.MANAGE_HOLDINGS && (
              <SPPortfolioManageHolding
                poolsInfo={poolsInfo}
                contracts={contractsInfo}
                portfolioData={portfolioBreakDown}
                gasPrices={gasPrices}
                delegatorConfig={delegatorConfig}
                poolsUndelegations={poolsUndelegations}
                rewards={rewards}
                cfsccAirdrops={cfsccAirdrops}
                sccAirdrops={sccAirdrops}
                rewardsUndelegations={rewardsUndelegations}
              />
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
}

export default Portfolio;
