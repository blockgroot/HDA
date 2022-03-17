import React from "react";
import { MySDRewardsType } from "../../../hooks/usePortfolioCFRewards";
import { nativeTokenFormatter } from "../../../utils/CurrencyHelper";
import { Typography } from "../../atoms";
import { CFMySDContainer } from "../../molecules";

type Props = {
  userInfo: MySDRewardsType;
  isLoading?: boolean;
};
export default function PortfolioMySDToken({ userInfo, isLoading }: Props) {
  const { totalSdTokens, totalRewards } = userInfo;

  return (
    <CFMySDContainer
      value={nativeTokenFormatter(totalSdTokens).toLocaleString()}
      info={"Learn more about SD Token vesting."}
      // info={"SD earned will be updated every 6 hours."}
      isLoading={isLoading}
    >
      <div className={"flex items-center justify-between"}>
        <Typography variant={"h3"}>
          My SD Earned
          {/*<Typography variant={"body2"} className={"inline ml-2"}>*/}
          {/*  (Estimated)*/}
          {/*</Typography>*/}
        </Typography>

        {/*<div className="portfolioTokenSwap m-2">*/}
        {/*  <img src={SwapIcon} alt="swap" className="swapIcon" />*/}
        {/*</div>*/}
      </div>
      {/*<Typography variant={"h2"} className={"mt-2"} color={"textSecondary"}>*/}
      {/*  {lunaFormatter(totalRewards).toLocaleString()}{" "}*/}
      {/*  <Typography*/}
      {/*    variant={"body2"}*/}
      {/*    color={"textSecondary"}*/}
      {/*    className={"inline"}*/}
      {/*  >*/}
      {/*    LUNA*/}
      {/*  </Typography>*/}
      {/*</Typography>*/}
      {/*<Typography variant={"body1"} color={"textSecondary"}>*/}
      {/*  Rewards*/}
      {/*</Typography>*/}
    </CFMySDContainer>
  );
}
