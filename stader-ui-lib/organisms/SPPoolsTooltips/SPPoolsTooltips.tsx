import { tooltips } from "@constants/constants";
import React from "react";
import { Box, Typography } from "../../atoms";
import { AirdropsTooltip } from "../../molecules";
import AirdropSvg from "@assets/svg/airdrops.svg";
import AirdropPinkSvg from "@assets/svg/airdrops_pink.svg";
import DecentralizedSvg from "@assets/svg/decentralization.svg";
import DecentralizedPinkSvg from "@assets/svg/decentralization_pink.svg";
import SlashingSvg from "@assets/svg/slashing.svg";
import SlashingPinkSvg from "@assets/svg/slashing_pink.svg";
import SPPoolsTooltip from "@molecules/SPPoolsTooltip/SPPoolsTooltip";
import styles from "./SPPoolsTooltips.module.scss";

function SPPoolsTooltips() {
  return (
    <Box className={"rounded-xl"} noPadding noBorderRadius>
      <div className={styles.container}>
        <Typography variant={"body1"} className="text-light-800 pr-6">
          All Stader pools
        </Typography>
        <div className={styles.tooltips_wrap}>
          <SPPoolsTooltip
            name={"airdrop"}
            label={"Include Airdrops"}
            tooltip={<AirdropsTooltip />}
            image={AirdropSvg}
            imageActive={AirdropPinkSvg}
          />
          <SPPoolsTooltip
            name={"decentralization"}
            label={"Promote Decentralization"}
            tooltip={tooltips.decentralization}
            image={DecentralizedSvg}
            imageActive={DecentralizedPinkSvg}
          />
          <SPPoolsTooltip
            name={"slashing"}
            label={"Minimize Slashing"}
            tooltip={tooltips.slashing}
            image={SlashingSvg}
            imageActive={SlashingPinkSvg}
          />
        </div>
      </div>
    </Box>
  );
}

export default SPPoolsTooltips;
