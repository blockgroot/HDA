import React, { useEffect, useState } from "react";
import {
  Button,
  ClickAwayListener,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import moment from "moment";
import { WalletStatus } from "@terra-money/wallet-provider";

import communityPoolIcon from "../../assets/svg/community_pool.svg";
import blueChipPoolIcon from "../../assets/svg/blue_chip_pool.svg";
import airdropPlusPoolIcon from "../../assets/svg/airdrops_plus_pool.svg";
import { useAirdropsDialog } from "../../dialogs/useAirdropsDialog";
import { useRewardsDialog } from "../../dialogs/useRewardsDialog";
import { useUndelegateRewardsDialog } from "../../dialogs/useUndelegateRewardsDialog";
import { useUndelegateDialog } from "../../dialogs/useUndelegateDialog";
import { useWithdrawFundsDialog } from "../../dialogs/useWithdrawFundsDialog";
import { useWithdrawRewardsDialog } from "../../dialogs/useWithdrawRewardsDialog";
import { getContractByName } from "../../utils/contractFilters";
import { lunaFormatter, lunaFormatterOrion } from "../../utils/CurrencyHelper";
import PortfolioZeroState from "../common/PortfolioZeroState";
import PortfolioPoolsZeroState from "../common/PortfolioPoolsZeroState";
import PortfolioWithdrawalZeroState from "../common/PortfolioWithdrawalZeroState";
import { InfoOutlined } from "@material-ui/icons";
import { tooltips, urls } from "../../constants/constants";
import { sortWithdrawDate } from "../../utils/helper";

interface Props {
  primaryWalletAddress?: string;
  terra?: any;
  wallet?: any;
  walletFunds?: any;
  contracts: any;
  rewardsBreakUp: any;
  poolsInfo: any;
  airdrops: any;
  cfsccAirdrops: any;
  sccAirdrops: any;
  poolsUndelegations: Array<any>;
  rewardsUndelegations: any;
  refreshPage: any;
  toggleConnectWallet: any;
  walletStatus: any;
  delegatorConfig: any;
  gasPrices: any;
}

function ManagePortfolio({
  primaryWalletAddress,
  terra,
  wallet,
  walletFunds,
  contracts,
  rewardsBreakUp,
  poolsInfo,
  airdrops,
  cfsccAirdrops,
  sccAirdrops,
  poolsUndelegations,
  rewardsUndelegations,
  refreshPage,
  toggleConnectWallet,
  walletStatus,
  delegatorConfig,
  gasPrices,
}: Props) {
  const [openAirdropsDialog, airdropsDialogElement] = useAirdropsDialog();
  const [openRewardsDialog, rewardsDialogElement] = useRewardsDialog();
  const [viewAirdropsDropdown, setViewAirdropsDropdown] = useState(false);
  const [openWithdrawFundsDialog, withdrawFundsDialogElement] =
    useWithdrawFundsDialog();
  const [openWithdrawRewardsDialog, withdrawRewardsDialogElement] =
    useWithdrawRewardsDialog();
  const [openUndelegateRewardsDialog, undelegateRewardsDialogElement] =
    useUndelegateRewardsDialog();
  const [openUndelegateDialog, undelegateDialogElement] = useUndelegateDialog();

  useEffect(() => {
    if (primaryWalletAddress && primaryWalletAddress !== "") {
    }
  }, [primaryWalletAddress]);

  const canWithdrawAirdrops = () => {
    const airdropTokens = Object.keys(airdrops);
    const areAirdropsPresent = airdropTokens.some((token: string) => {
      return parseInt(airdrops[token].amount) > 1000;
    });

    return areAirdropsPresent;
  };

  const onClickAwayViewAirdrops = () => {
    setViewAirdropsDropdown(false);
  };

  const toggleOpenViewAirdrops = () => {
    setViewAirdropsDropdown(!viewAirdropsDropdown);
  };

  return (
    <div className="myPortfolioContainer">
      {(primaryWalletAddress && primaryWalletAddress !== "") ||
      walletStatus === WalletStatus.INITIALIZING ? (
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <p className="portfolioCardHeader portfolioCardHeaderTop">
                Airdrops
              </p>
            </Grid>
            <Grid item xs={12}>
              <div className="portfolioCard">
                <div className="portfolioCardRowContent">
                  <div className="airdropsContentInfo">
                    {Object.keys(airdrops).map(
                      (airdropToken: string, index: number) =>
                        index <= 2 ? (
                          <div
                            className="airdropsContent"
                            key={`airdrop-1-${airdropToken}`}
                          >
                            <p className="airdropsContentText">
                              {airdropToken === "orion"
                                ? lunaFormatterOrion(
                                    airdrops[airdropToken].amount
                                  )
                                : lunaFormatter(
                                    airdrops[airdropToken].amount
                                  )}{" "}
                              <span className="airdropsContentTextSmall">
                                {airdropToken}{" "}
                                <img
                                  src={
                                    airdropToken === "anc"
                                      ? "/static/anc.png"
                                      : airdropToken === "mir"
                                      ? "/static/mir.png"
                                      : airdropToken === "mine"
                                      ? "/static/pylon.png"
                                      : airdropToken === "orion"
                                      ? "/static/orion.png"
                                      : airdropToken === "twd"
                                      ? "/static/twd.png"
                                      : "/static/valkyrie.png"
                                  }
                                  alt={airdropToken}
                                  height={12}
                                  style={{ marginLeft: 8 }}
                                />
                              </span>
                            </p>
                          </div>
                        ) : null
                    )}
                    {Object.keys(airdrops).length > 2 ? (
                      <div>
                        <ClickAwayListener
                          onClickAway={onClickAwayViewAirdrops}
                        >
                          <div className="filter">
                            <div
                              className="legendsViewAll"
                              onClick={() => toggleOpenViewAirdrops()}
                            >
                              View All
                            </div>
                            {viewAirdropsDropdown && (
                              <div className="dropdown-container">
                                <div className="dropdown-box filterDropdown">
                                  <div className="filterDropdownContainer">
                                    {Object.keys(airdrops).map(
                                      (airdropToken: string, index: number) => (
                                        <div
                                          className="filterItem"
                                          key={`airdrop-2-${airdropToken}`}
                                        >
                                          <p className="legendValue">
                                            {airdropToken === "orion"
                                              ? lunaFormatterOrion(
                                                  airdrops[airdropToken].amount
                                                )
                                              : lunaFormatter(
                                                  airdrops[airdropToken].amount
                                                )}{" "}
                                            <span className="legendValueDenom">
                                              {airdropToken}{" "}
                                              <img
                                                src={
                                                  airdropToken === "anc"
                                                    ? "/static/anc.png"
                                                    : airdropToken === "mir"
                                                    ? "/static/mir.png"
                                                    : airdropToken === "mine"
                                                    ? "/static/pylon.png"
                                                    : airdropToken === "orion"
                                                    ? "/static/orion.png"
                                                    : airdropToken === "twd"
                                                    ? "/static/twd.png"
                                                    : "/static/valkyrie.png"
                                                }
                                                alt={airdropToken}
                                                height={12}
                                                style={{ marginLeft: 8 }}
                                                className="legendImage"
                                              />
                                            </span>
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </ClickAwayListener>
                      </div>
                    ) : null}
                  </div>
                  <Button
                    className="borderdButton"
                    disabled={!canWithdrawAirdrops()}
                    disableRipple
                    disableTouchRipple
                    disableFocusRipple
                    onClick={() => {
                      openAirdropsDialog({
                        primaryWalletAddress: primaryWalletAddress || "",
                        sccContractAddress: getContractByName(contracts, "scc"),
                        cfsccContractAddress: getContractByName(
                          contracts,
                          "cfscc"
                        ),
                        cfsccAirdrops,
                        sccAirdrops,
                        wallet,
                        refreshPage,
                        terra,
                        walletFunds,
                        gasPrices,
                      });
                    }}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            </Grid>

            <Grid item xs={12}>
              <p className="portfolioCardHeader">Rewards</p>
            </Grid>

            <Grid item xs={12}>
              <div className="portfolioCard">
                {rewardsBreakUp &&
                  rewardsBreakUp.length > 0 &&
                  rewardsBreakUp.map((rewardInfo: any) => (
                    <div
                      className="portfolioCardRowContent"
                      key={rewardInfo.strategy_id}
                    >
                      <div className="contentInfo">
                        <div className="content">
                          <p
                            className={
                              rewardInfo.strategy_id === 0
                                ? "contentText contentTextRetainRewards"
                                : "contentText contentTextAutoCompounding"
                            }
                          >
                            {rewardInfo.strategy_id === 0
                              ? "Retain Rewards"
                              : "Auto Compounding"}
                          </p>
                        </div>
                        <p className="contentValue">
                          {lunaFormatter(parseInt(rewardInfo.total_rewards))}{" "}
                          <span className="contentValueSmall">LUNA</span>
                        </p>
                      </div>
                      <Button
                        className="borderdButton"
                        disabled={parseInt(rewardInfo.total_rewards) < 1000}
                        disableRipple
                        disableTouchRipple
                        disableFocusRipple
                        // onClick={() => {
                        //   rewardInfo.strategy_id === 0
                        //     ? openRewardsDialog({
                        //         primaryWalletAddress:
                        //           primaryWalletAddress || "",
                        //         title: "Retain Rewards",
                        //         rewards: rewardInfo,
                        //         contractAddress: getContractByName(
                        //           contracts,
                        //           "scc"
                        //         ),
                        //         strategyId: rewardInfo.strategy_id,
                        //         wallet,
                        //         walletFunds,
                        //         gasPrices,
                        //         refreshPage,
                        //         terra,
                        //       })
                        //     : openUndelegateRewardsDialog({
                        //         primaryWalletAddress:
                        //           primaryWalletAddress || "",
                        //         maxAmount: parseFloat(
                        //           (
                        //             rewardInfo.total_rewards / 1000000
                        //           ).toString()
                        //         ),
                        //         title: "Auto Compounding",
                        //         contractAddress: getContractByName(
                        //           contracts,
                        //           "scc"
                        //         ),
                        //         strategyId: rewardInfo.strategy_id,
                        //         wallet,
                        //         walletFunds,
                        //         gasPrices,
                        //         refreshPage,
                        //         terra,
                        //       });
                        // }}
                      >
                        {rewardInfo.strategy_id === 0
                          ? "Withdraw"
                          : "Undelegate"}
                      </Button>
                    </div>
                  ))}
              </div>
            </Grid>

            <Grid item xs={12}>
              <p className="portfolioCardHeader">Deposits</p>
            </Grid>

            {poolsInfo && poolsInfo.length > 0 ? (
              <Grid item xs={12}>
                <div className="portfolioCard">
                  {poolsInfo.map((pool: any) => (
                    <div
                      className="portfolioCardRowContent"
                      key={`pool-${pool.pool_id}`}
                    >
                      <div className="contentInfo">
                        <div className="content">
                          <img
                            src={
                              pool.pool_name.includes("Airdrops Plus")
                                ? airdropPlusPoolIcon
                                : pool.pool_name.includes("Community")
                                ? communityPoolIcon
                                : blueChipPoolIcon
                            }
                            alt="community"
                            className="contentImg"
                          />
                          <p
                            className={
                              pool.pool_name.includes("Airdrops Plus")
                                ? "contentText contentTextAirdropPlus"
                                : pool.pool_name.includes("Community")
                                ? "contentText contentTextAutoCompounding"
                                : "contentText contentTextRetainRewards"
                            }
                          >
                            {pool.pool_name.includes("Airdrops Plus")
                              ? "Airdrops Plus"
                              : pool.pool_name.includes("Community")
                              ? "Community"
                              : "Blue Chip"}
                          </p>
                        </div>
                        <p className="contentValue">
                          {pool.computed_deposit && pool.computed_deposit > 0
                            ? lunaFormatter(pool.computed_deposit)
                            : pool.deposit.staked > 0
                            ? lunaFormatter(pool.deposit.staked)
                            : 0}{" "}
                          <span className="contentValueSmall">LUNA</span>
                        </p>
                      </div>
                      <Button
                        className="borderdButton"
                        disabled={
                          parseInt(pool.deposit.staked) < 1000 ||
                          (poolsUndelegations &&
                            poolsUndelegations.length >=
                              delegatorConfig.undelegations_max_limit)
                        }
                        disableRipple
                        disableTouchRipple
                        disableFocusRipple
                        onClick={() =>
                          openUndelegateDialog({
                            poolId: pool.pool_id,
                            primaryWalletAddress: primaryWalletAddress || "",
                            maxAmount: parseFloat(
                              (pool.deposit.staked / 1000000).toFixed(6)
                            ),
                            protocolFee:
                              delegatorConfig && delegatorConfig.protocol_fee
                                ? delegatorConfig.protocol_fee * 100
                                : 1,
                            title: pool.pool_name.includes("Airdrops Plus")
                              ? "Airdrops Plus"
                              : pool.pool_name.includes("Community")
                              ? "Community"
                              : "Blue Chip",
                            contractAddress: getContractByName(
                              contracts,
                              "Pools"
                            ),
                            wallet,
                            refreshPage,
                            terra,
                            walletFunds,
                            gasPrices,
                          })
                        }
                      >
                        Undelegate
                      </Button>
                    </div>
                  ))}

                  <Divider className="portfolioCardDivider" />
                </div>
              </Grid>
            ) : (
              <PortfolioPoolsZeroState />
            )}

            <Grid item xs={12}>
              <p className="portfolioCardHeader">Withdrawals</p>
            </Grid>
            {(poolsUndelegations && poolsUndelegations.length > 0) ||
            (rewardsUndelegations && rewardsUndelegations.length > 0) ? (
              <Grid item xs={12}>
                <div className="portfolioCard">
                  <TableContainer className="portfolioTable">
                    <Table aria-label="simple table">
                      <TableHead className="portfolioTableHeader">
                        <TableRow>
                          <TableCell
                            align="left"
                            className="portfolioTableHeaderText"
                            colSpan={1}
                          >
                            Type
                          </TableCell>
                          <TableCell
                            align="left"
                            className="portfolioTableHeaderText"
                          >
                            Amount
                          </TableCell>
                          <TableCell
                            align="left"
                            className="portfolioTableHeaderText"
                          >
                            Release Time
                          </TableCell>
                          <TableCell
                            align="left"
                            className="portfolioTableHeaderText"
                            colSpan={4}
                          ></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className="portfolioTableBody">
                        {poolsUndelegations &&
                          poolsUndelegations.length > 0 &&
                          sortWithdrawDate(
                            poolsUndelegations,
                            (obj) => obj.undelegationInfo.est_release_time
                          ).map((undelegation: any) => (
                            <TableRow
                              key={undelegation.id}
                              style={{ borderBottom: "none" }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                colSpan={1}
                                className="portfolioTableBodyText"
                              >
                                {undelegation.pool_name}
                              </TableCell>
                              <TableCell
                                align="left"
                                className="portfolioTableBodyText"
                              >
                                {undelegation.undelegationInfo
                                  .computed_undelegation_amount
                                  ? lunaFormatter(
                                      undelegation.undelegationInfo
                                        .computed_undelegation_amount
                                    )
                                  : lunaFormatter(undelegation.amount)}{" "}
                                <span className="portfolioTableBodyTextSmall">
                                  LUNA
                                </span>
                              </TableCell>
                              {undelegation.undelegationInfo
                                .est_release_time ? (
                                <TableCell
                                  align="left"
                                  className="portfolioTableBodyText"
                                >
                                  {moment
                                    .unix(
                                      undelegation.undelegationInfo
                                        .est_release_time / 1000000000
                                    )
                                    .add(15, "minutes")
                                    .format("lll")}
                                </TableCell>
                              ) : (
                                <TableCell
                                  align="left"
                                  className="portfolioTableBodyText"
                                >
                                  Undelegations take 21 to 24 days.
                                  <span>
                                    <Tooltip
                                      title={tooltips.withdrawals}
                                      classes={{
                                        tooltip: "tooltip",
                                        arrow: "arrow",
                                      }}
                                      placement={"bottom"}
                                      arrow
                                    >
                                      <InfoOutlined className="portfolioInfoIcon" />
                                    </Tooltip>
                                  </span>
                                </TableCell>
                              )}

                              <TableCell
                                align="right"
                                colSpan={4}
                                className="portfolioTableBodyText"
                              >
                                <div className="portfolioBodyButtonWrapper">
                                  <Button
                                    className="portfolioBodyButton"
                                    disabled={
                                      !undelegation.undelegationInfo.reconciled
                                    }
                                    disableRipple
                                    disableTouchRipple
                                    disableFocusRipple
                                    onClick={() => {
                                      openWithdrawFundsDialog({
                                        primaryWalletAddress:
                                          primaryWalletAddress || "",
                                        contractAddress: getContractByName(
                                          contracts,
                                          "Pools"
                                        ),
                                        title: undelegation.pool_name,
                                        wallet,
                                        amount: undelegation.undelegationInfo
                                          .computed_undelegation_amount
                                          ? undelegation.undelegationInfo
                                              .computed_undelegation_amount
                                          : undelegation.amount,
                                        protocolFee:
                                          delegatorConfig &&
                                          delegatorConfig.protocol_fee
                                            ? delegatorConfig.protocol_fee * 100
                                            : 1,
                                        poolId: undelegation.pool_id,
                                        undelegationId:
                                          undelegation.id as number,
                                        undelegationBatchId:
                                          undelegation.batch_id as number,
                                        refreshPage,
                                        terra,
                                        walletFunds,
                                        gasPrices,
                                      });
                                    }}
                                  >
                                    Withdraw
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      <TableBody className="portfolioTableBody">
                        {rewardsUndelegations &&
                          rewardsUndelegations.length > 0 &&
                          rewardsUndelegations.map((undelegation: any) => (
                            <TableRow
                              key={undelegation.id}
                              style={{ borderBottom: "none" }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                colSpan={1}
                                className="portfolioTableBodyText"
                              >
                                {undelegation.strategy_id === 1
                                  ? "Auto Compounding"
                                  : "Retain Rewards"}
                              </TableCell>
                              <TableCell
                                align="left"
                                className="portfolioTableBodyText"
                              >
                                {lunaFormatter(undelegation.amount)}{" "}
                                <span className="portfolioTableBodyTextSmall">
                                  LUNA
                                </span>
                              </TableCell>
                              <TableCell
                                align="left"
                                className="portfolioTableBodyText"
                              >
                                {undelegation.undelegationInfo.est_release_time
                                  ? moment
                                      .unix(
                                        undelegation.undelegationInfo
                                          .est_release_time / 1000000000
                                      )
                                      .add(15, "minutes")
                                      .format("lll")
                                  : "Undelegation under process"}
                              </TableCell>
                              <TableCell
                                align="right"
                                colSpan={4}
                                className="portfolioTableBodyText"
                              >
                                <div className="portfolioBodyButtonWrapper">
                                  <Button
                                    className="portfolioBodyButton"
                                    disabled={
                                      !undelegation.undelegationInfo
                                        .est_release_time ||
                                      moment().isBefore(
                                        moment
                                          .unix(
                                            undelegation.undelegationInfo
                                              .est_release_time / 1000000000
                                          )
                                          .add(15, "minutes")
                                          .format("lll")
                                      )
                                    }
                                    disableRipple
                                    disableTouchRipple
                                    disableFocusRipple
                                    // onClick={() => {
                                    //   openWithdrawRewardsDialog({
                                    //     primaryWalletAddress:
                                    //       primaryWalletAddress || "",
                                    //     contractAddress: getContractByName(
                                    //       contracts,
                                    //       "scc"
                                    //     ),
                                    //     title:
                                    //       undelegation.strategy_id === 1
                                    //         ? "Auto Compounding"
                                    //         : "Retain Rewards",
                                    //     wallet,
                                    //     walletFunds,
                                    //     gasPrices,
                                    //     amount: undelegation.amount,

                                    //     undelegationId:
                                    //       undelegation.id as number,
                                    //     strategyId:
                                    //       undelegation.strategy_id as number,
                                    //     refreshPage,
                                    //     terra,
                                    //   });
                                    // }}
                                  >
                                    Withdraw
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>
            ) : (
              <PortfolioWithdrawalZeroState />
            )}
          </Grid>
          {airdropsDialogElement}
          {rewardsDialogElement}
          {withdrawFundsDialogElement}
          {withdrawRewardsDialogElement}
          {undelegateRewardsDialogElement}
          {undelegateDialogElement}
        </div>
      ) : (
        <PortfolioZeroState toggleConnectWallet={toggleConnectWallet} />
      )}
    </div>
  );
}

export default ManagePortfolio;
