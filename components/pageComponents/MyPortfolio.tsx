import React, { useEffect, useState, useCallback } from "react";
import { Grid, Tooltip, Divider } from "@material-ui/core";

import PortfolioDonutChart from "../common/PortfolioDonutChart";

import { InfoOutlined } from "@material-ui/icons";
import { tooltips, transactionsStatusMap } from "../../constants/constants";
import TransactionsZeroState from "../common/TransactionsZeroState";
import { lunaFormatter } from "../../utils/CurrencyHelper";

// import WelcomeDashboardPage from "./pages/WelcomeDashboardPage";

interface Props {
  primaryWalletAddress?: string;
  terra?: any;
  wallet?: any;
  walletFunds?: any;
  contracts: any;
  pools: any;
  apr: number;
  transactions: any;
  portfolioBreakDown: any;
  toggleConnectWallet: any;
  walletStatus: any;
}

function MyPortfolio({
  primaryWalletAddress,
  terra,
  wallet,
  walletFunds,
  contracts,
  pools,
  apr,
  transactions,
  portfolioBreakDown,
  toggleConnectWallet,
}: Props) {
  const [openFilter, setOpenFilter] = useState(false);
  const [portfolio, setPortfolio] = useState({
    total: 0,
    deposits: 0,
    rewards: 0,
    airdrops: null,
  });
  const [seriesData, setSeriesData] = useState<any[]>([]);

  useEffect(() => {
    if (primaryWalletAddress && primaryWalletAddress !== "") {
    }

    if (portfolioBreakDown && portfolioBreakDown.total !== portfolio.total) {
      let series = [100];

      if (portfolioBreakDown.total > 0) {
        // TODO - GM. These need to be removed?
        let airdrops =
          portfolioBreakDown.airdrops.anc.amountInLuna +
          portfolioBreakDown.airdrops.mir.amountInLuna +
          portfolioBreakDown.airdrops.mine.amountInLuna +
          portfolioBreakDown.airdrops.vkr.amountInLuna +
          portfolioBreakDown.airdrops.orion.amountInLuna +
          portfolioBreakDown.airdrops.twd.amountInLuna;

        series = [
          // airdrops,
          portfolioBreakDown.total_rewards,
          portfolioBreakDown.deposits,
        ];
      }

      setPortfolio(portfolioBreakDown);
      setSeriesData(series);
    }
  }, [primaryWalletAddress, portfolioBreakDown]);

  const onClickAwayFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const toggleOpenFilter = useCallback(() => {
    setOpenFilter((prev) => !prev);
  }, []);

  const getLabels = () => {
    const totalDeposits = portfolioBreakDown.total;
    if (totalDeposits > 0) {
      return [/*"Airdrops",*/ "Rewards", "Deposit"];
    } else {
      return [];
    }
  };

  const showLabels = () => {
    const totalDeposits = portfolioBreakDown.total;

    if (totalDeposits > 0) {
      return 1;
    } else {
      return 0;
    }
  };

  const getColors = () => {
    const { total } = portfolioBreakDown;

    let colors = ["#2E2E2E"];
    if (total > 0) {
      colors = [/*"#43b8d2", */ "#8989EB", "#ce41bd"];
    }

    return colors;
  };

  return (
    <div className="myPortfolioContainer">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <div className="portfolioCard justify-content-between">
            <div className="portfolioMetrixInfo">
              <p className="portfolioMetrix">
                {lunaFormatter(portfolioBreakDown.total)}{" "}
                <span className="portfolioMetrixSmallText">LUNA</span>
              </p>
              <p className="portfolioMetrixDesc">
                Total Holdings
                <span>
                  <Tooltip
                    title={tooltips.totalHoldings}
                    placement={"bottom"}
                    arrow
                    classes={{
                      tooltip: "tooltip",
                      arrow: "arrow",
                    }}
                  >
                    <InfoOutlined className="infoIcon" />
                  </Tooltip>
                </span>
              </p>
            </div>
            <Divider className="portfolioCardDivider" />
            <div className="portfolioMetrixInfo">
              <p className="portfolioMetrix">
                {apr && apr > 0 ? `${apr.toFixed(2)}%` : "N.A"}
              </p>
              <p className="portfolioMetrixDesc">
                Expected APR{" "}
                <span>
                  <Tooltip
                    title={tooltips.aprAirdrops}
                    placement={"bottom"}
                    arrow
                    classes={{
                      tooltip: "tooltip",
                      arrow: "arrow",
                    }}
                  >
                    <InfoOutlined className="infoIcon" />
                  </Tooltip>
                </span>
              </p>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <div className="portfolioCard portfolioCardBreakUp">
            <PortfolioDonutChart
              deposits={portfolioBreakDown.deposits}
              totalRewards={portfolioBreakDown.total_rewards}
              pendingRewards={portfolioBreakDown.pending_rewards}
              airdrops={portfolioBreakDown.airdrops}
              total={portfolioBreakDown.total}
              seriesData={seriesData}
              getColors={getColors}
              getLabels={getLabels}
              showLabels={showLabels}
            />
          </div>
        </Grid>
        {/* <Grid item xs={12}>
					<div className="portfolioCard portfolioCardTransactions">
						<div className="transactionsHeader">
							<p className="transactionsHeaderText">Transactions</p> */}
        {/* {transactions && transactions.length > 0 ? (
								<div className="filter">
									<p className="filterText">All Transactions</p>
									<ClickAwayListener onClickAway={onClickAwayFilter}>
										<div>
											{openFilter ? (
												<KeyboardArrowUp
													style={{ color: "#E548D2" }}
													className="arrowIcon"
													onClick={() => toggleOpenFilter()}
												/>
											) : (
												<KeyboardArrowDown
													style={{ color: "#E548D2" }}
													className="arrowIcon"
													onClick={() => toggleOpenFilter()}
												/>
											)}
											{openFilter && (
												<div className="dropdown-container">
													<div className="dropdown-box filterDropdown">
														<div className="filterDropdownContainer">
															<div className="filterItem">
																<Check
																	style={{ color: "#E548D2", marginRight: 8 }}
																/>

																<p className={"filterItemTextActive"}>
																	All Transactions
																</p>
															</div>
														</div>
													</div>
												</div>
											)}
										</div>
									</ClickAwayListener>
								</div>
							) : null} */}
        {/* </div> */}
        {/* {transactions && transactions.length > 0 ? (
							<div className="transactionsBody">
								<div>
									{transactions.map((transaction: any) => (
										<div key={transaction.txhash} className="transaction">
											<div className="transactionContent">
												{transaction &&
												(transaction.poolId ||
													transaction.strategyId ||
													transaction.poolId === 0 ||
													transaction.strategyId === 0) ? (
													<p className="transactionContentText">
														{getEntityTitle(transaction)}
													</p>
												) : null}
												<div className="transactionAction">
													<p className="action">
														{
															transactionsStatusMap[
																transaction.transactionType as keyof typeof transactionsStatusMap
															]
														}{" "}
													</p>
													<p className="actionAmount">
														{lunaFormatter(transaction.coins[0].amount)}
														<span className="actionDenom">LUNA</span>
													</p>
												</div>
											</div>

											<p className="transactionDate">
												{moment(`${transaction.createdAtDate} UTC`)
													.format("lll")
													.toLocaleString()}
											</p>
										</div>
									))}
								</div>
							</div>
						) : (
							<TransactionsZeroState
								toggleConnectWallet={toggleConnectWallet}
								primaryWalletAddress={primaryWalletAddress}
							/>
						)} */}
        {/* </div>
				</Grid> */}
      </Grid>
    </div>
  );
}

export default MyPortfolio;
