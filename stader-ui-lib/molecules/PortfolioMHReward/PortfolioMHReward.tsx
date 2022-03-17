import { Button } from "@material-ui/core";
import { LiquidStakingState } from "@types_/liquid-staking-pool";
import { getContractByName } from "@utils/contractFilters";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import React from "react";
import { useRewardsDialog } from "../../../dialogs/useRewardsDialog";
import { useUndelegateRewardsDialog } from "../../../dialogs/useUndelegateRewardsDialog";
import { Typography } from "../../atoms";
import { NATIVE_TOKEN_LABEL } from "@constants/constants";

interface Props {
  rewards: any[];
  contracts: any;
  gasPrices: any;
}

export default function PortfolioMHReward({
  rewards,
  contracts,
}: Props) {
  const [openRewardsDialog, rewardsDialogElement] = useRewardsDialog();
  const [openUndelegateRewardsDialog, undelegateRewardsDialogElement] =
    useUndelegateRewardsDialog();
  return (
    <div className={"myPortfolioContainer"}>
      <Typography variant={"h2"} fontWeight={"bold"} className={"mb-4"}>
        Rewards
      </Typography>
      <div className="portfolioCard">
        {rewards &&
          rewards.length > 0 &&
          rewards.map((rewardInfo: any) => (
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
                  {nativeTokenFormatter(parseInt(rewardInfo.total_rewards))}{" "}
                  <span className="contentValueSmall">{NATIVE_TOKEN_LABEL}</span>
                </p>
              </div>
              <Button
                className="borderdButton"
                disabled={parseInt(rewardInfo.total_rewards) < 1000}
                disableRipple
                disableTouchRipple
                disableFocusRipple
                onClick={() => {
                  rewardInfo.strategy_id === 0
                    ? openRewardsDialog({
                        title: "Retain Rewards",
                        rewards: rewardInfo,
                        sccContractAddress: getContractByName(contracts, "scc"),
                        strategyId: rewardInfo.strategy_id,
                      })
                    : openUndelegateRewardsDialog({
                        maxAmount: parseFloat(
                          (rewardInfo.total_rewards / 1000000).toString()
                        ),
                        title: "Auto Compounding",
                        contractAddress: getContractByName(contracts, "scc"),
                        strategyId: rewardInfo.strategy_id,
                      });
                }}
              >
                {rewardInfo.strategy_id === 0 ? "Withdraw" : "Undelegate"}
              </Button>
            </div>
          ))}
        {rewardsDialogElement}
        {undelegateRewardsDialogElement}
      </div>
    </div>
  );
}
