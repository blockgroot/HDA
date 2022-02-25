import React from "react";
import { Box, Typography } from "../../atoms";
import { Button } from "@atoms/index";
import { lunaFormatter } from "@utils/CurrencyHelper";
import { getContractByName } from "@utils/contractFilters";
import { useRewardsDialog } from "../../../dialogs/useRewardsDialog";
import { useUndelegateRewardsDialog } from "../../../dialogs/useUndelegateRewardsDialog";
import styles from "./PortfolioMHRewards.module.scss";
import SPManageHoldingLunaLists from "@molecules/SPManageHoldingLunaLists/SPManageHoldingLunaLists";

interface Props {
  rewards: any[];
  contracts: any;
  gasPrices: any;
}

export default function PortfolioMHReward({ rewards, contracts }: Props) {
  const [openRewardsDialog, rewardsDialogElement] = useRewardsDialog();
  const [openUndelegateRewardsDialog, undelegateRewardsDialogElement] =
    useUndelegateRewardsDialog();
  return (
    <div>
      <Typography variant={"h2"} fontWeight={"bold"} className={"mb-4"}>
        Rewards
      </Typography>
      <Box noPadding>
        {rewards &&
          rewards.length > 0 &&
          rewards.map((rewardInfo: any) => (
            <SPManageHoldingLunaLists
              key={rewardInfo.strategy_id}
              label={
                <Typography
                  variant="h3"
                  fontWeight="medium"
                  color={rewardInfo.strategy_id === 0 ? "secondary" : "primary"}
                >
                  {rewardInfo.strategy_id === 0
                    ? "Retain Rewards"
                    : "Auto Compounding"}
                </Typography>
              }
              value={lunaFormatter(parseInt(rewardInfo.total_rewards))}
              button={
                <Button
                  disabled={parseInt(rewardInfo.total_rewards) < 1000}
                  size="small"
                  className={styles.button}
                  onClick={() => {
                    rewardInfo.strategy_id === 0
                      ? openRewardsDialog({
                          title: "Retain Rewards",
                          rewards: rewardInfo,
                          sccContractAddress: getContractByName(
                            contracts,
                            "scc"
                          ),
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
              }
            />
          ))}
        {rewardsDialogElement}
        {undelegateRewardsDialogElement}
      </Box>
    </div>
  );
}
