import React from "react";
import Logo from "../../atoms/Logo/Logo";
import { Box, Loader, Typography } from "../../atoms";
import RewardInfo from "../../molecules/RewardInfo/RewardInfo";
import styles from "./CFMySDContainer.module.scss";

type Props = {
  value: string;
  info: string;
  children?: any;
  isLoading?: boolean;
};
export default function CFMySDContainer(props: Props) {
  const { value, children, info, isLoading } = props;

  const renderElement = (
    <div>
      <Logo height={48} width={48} />
      <Typography variant={"h1"} fontWeight={"semi-bold"} className={"mt-4"}>
        {value}
      </Typography>
      <div className={"mt-5 mb-3"}>{children}</div>
      <RewardInfo
        label={info}
        link={
          "https://staderlabs.notion.site/Stader-Stake-Pools-FAQs-05baa5bf225a41b0a149531690a89957"
        }
      />
    </div>
  );

  return (
    <Box noPadding className={styles.root} gradientOutline>
      {isLoading ? <Loader className={"mx-auto"} /> : renderElement}
    </Box>
  );
}
