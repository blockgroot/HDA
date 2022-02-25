import React from "react";
import { CFSDPriceTotalContainer } from "../../molecules";
import { PortfolioSDPriceTotalType } from "../../../@types/portfolio";

interface Props extends PortfolioSDPriceTotalType {
  isLoading?: boolean;
}

export default function PortfolioCFSDTokenTotal(props: Props) {
  const { totalSdTokens, sdTokenPrice, isLoading } = props;
  return (
    <CFSDPriceTotalContainer
      tokenPrice={sdTokenPrice}
      totalFarmed={totalSdTokens}
      overallTotal={"3,000,000"}
      info={"Total SD farmed is updated every 24 hours."}
      isLoading={isLoading}
    />
  );
}
