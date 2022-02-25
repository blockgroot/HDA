import { tooltips } from "@constants/constants";
import React from "react";
import { Typography } from "../../atoms";
import styles from "./SPPoolsTableHead.module.scss";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";

function SPPoolsTableHead() {
  return (
    <div className={styles.root}>
      <div className={styles.col_1}>
        <Typography variant={"body1"} fontWeight={"bold"}>
          Stake Pools
        </Typography>
      </div>
      <div className={styles.col_2_3}>
        <Typography variant={"body1"} fontWeight={"bold"}>
          My Deposits
        </Typography>
      </div>
      <div className={styles.col_2_4}>
        <Typography variant={"body1"} fontWeight={"bold"}>
          APR
        </Typography>
        <SDTooltip
          content={tooltips.poolsAPR}
          className={styles.tooltip_icon}
        />
        {/* <Tooltip
          title={tooltips.poolsAPR}
          classes={{ tooltip: "tooltip", arrow: "arrow" }}
          placement={"bottom"}
          arrow
        >
          <InfoOutlinedIcon className={"ml-2"} style={{ fontSize: 16 }} />
        </Tooltip> */}
      </div>
      <div className={styles.col_4} />
    </div>
  );
}

export default SPPoolsTableHead;
