import React from "react";
import { Box, Loader, Typography } from "../../atoms";
import RewardInfo from "../../molecules/RewardInfo/RewardInfo";
import styles from "./CFSDPriceTotalContainer.module.scss";

type Props = {
  tokenPrice: number;
  totalFarmed: number | string;
  overallTotal: string | number;
  info: string;
  isLoading?: boolean;
};

function CFSDPriceTotalContainer(props: Props) {
  const { tokenPrice, totalFarmed, overallTotal, info, isLoading } = props;

  const renderElement = (
    <>
      <div className={"flex justify-between"}>
        <Typography>Total SD Tokens Farmed</Typography>
        <Typography>{totalFarmed}</Typography>
      </div>
      <div className={styles.total}>
        <Typography>Total SD Tokens Allocated</Typography>
        <div className="flex flex-col items-end">
          <Typography>{overallTotal}</Typography>
        </div>
      </div>
      <RewardInfo label={info} />
    </>
  );

  return (
    <Box noPadding className={styles.root}>
      {isLoading ? <Loader className={"mx-auto"} /> : renderElement}
    </Box>
  );
}

export default CFSDPriceTotalContainer;
