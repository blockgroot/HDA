import React from "react";
import { lunaFormatter } from "@utils/CurrencyHelper";
import { Typography } from "../../atoms";
import styles from "./PortfolioDepositRewards.module.scss";
import classNames from "classnames";
import { PortfolioDataType } from "@types_/portfolio";
import { Tooltip } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import SPPortfolioAirdrop from "../SPPortfolioAirdrop/SPPortfolioAirdrop";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";

interface Props {
  portfolioBreakDown: PortfolioDataType;
}

function PortfolioDepositRewards(props: Props) {
  const { portfolioBreakDown } = props;
  const { deposits, airdrops, total_rewards, pending_rewards } =
    portfolioBreakDown;

  return (
    <React.Fragment>
      <div className={styles.root}>
        <div className={styles.main_wrapper}>
          <div className={classNames(styles.marker, styles.marker_1)} />
          <div className={styles.wrapper}>
            <Typography
              color={"textSecondary"}
              variant={"body1"}
              fontWeight={"bold"}
              className={styles.title}
            >
              Deposits
            </Typography>
            <div className={"flex items-end"}>
              <Typography
                variant={"h2"}
                className={`${styles.airdrop_value} mr-2`}
              >
                {lunaFormatter(deposits).toString()}
              </Typography>
              <Typography variant={"body3"} className={styles.airdrop_label}>
                LUNA
              </Typography>
            </div>
          </div>
        </div>
        <div className={styles.main_wrapper}>
          <div className={classNames(styles.marker, styles.marker_2)} />
          <div className={styles.wrapper}>
            <Typography
              color={"textSecondary"}
              variant={"body1"}
              fontWeight={"bold"}
              className={styles.title}
            >
              Rewards
            </Typography>
            <div className={styles.reward_wrapper}>
              <Typography
                variant={"h2"}
                className={`${styles.airdrop_value} mr-2`}
              >
                {lunaFormatter(total_rewards)}
              </Typography>
              <Typography variant={"body3"} className={styles.airdrop_label}>
                LUNA
              </Typography>
              <SDTooltip
                content={
                  lunaFormatter(pending_rewards) +
                  " Luna is yet to be moved to strategies."
                }
                className="text-white ml-3"
                fontSize={"small"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="customLegends">
        <div className={styles.main_wrapper}>
          <div className={classNames(styles.marker, styles.marker_3)} />
          <div className={styles.wrapper}>
            <Typography
              color={"textSecondary"}
              variant={"body1"}
              fontWeight={"bold"}
              className={styles.title}
            >
              Airdrops
            </Typography>
            <div className={styles.airdrops}>
              <SPPortfolioAirdrop airdrops={airdrops} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default PortfolioDepositRewards;
