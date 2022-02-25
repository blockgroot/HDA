import React from "react";
import { CFMySDContainer } from "../../molecules";
import { Typography } from "../../atoms";
import { FarmedReward } from "../../../@types/liquid-staking-reward";

interface Props {
  farmedReward: FarmedReward;
  isLoading?: boolean;
}

function LSRewardCF({ farmedReward, isLoading }: Props) {
  return (
    <CFMySDContainer
      value={farmedReward.totalSdTokens.toFixed(6)}
      info={
        "SD Rewards are distributed every Tuesday based on two random snapshots taken in the previous week."
      }
      isLoading={isLoading}
    >
      <Typography variant={"h3"}>My SD Tokens</Typography>
    </CFMySDContainer>
  );
}

export default LSRewardCF;
