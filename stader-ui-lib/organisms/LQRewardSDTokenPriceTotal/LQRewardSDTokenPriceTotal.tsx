import React from "react";
import { CFSDPriceTotalContainer } from "../../molecules";

const liquidStakingSDPrice = 0.73;

function LQRewardSDTokenPriceTotal() {
  const dec07 = new Date("2021-12-07T12:00:00").getTime();
  const today = new Date().getTime();
  const tokenFarmed = parseInt(
    (Math.floor((today - dec07) / (1000 * 3600 * 24)) * 25000).toFixed(0)
  );

  return (
    <CFSDPriceTotalContainer
      tokenPrice={liquidStakingSDPrice}
      overallTotal={"1,500,000"}
      totalFarmed={tokenFarmed}
      info={"Total SD farmed is updated once every day."}
    />
  );
}

export default LQRewardSDTokenPriceTotal;
