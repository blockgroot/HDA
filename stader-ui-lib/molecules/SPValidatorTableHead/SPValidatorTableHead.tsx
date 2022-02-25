import React, {useEffect, useState} from "react";
import c from "classnames";
import { Tooltip } from "@material-ui/core";
import { tooltips } from "@constants/constants";
import { Typography } from "../../atoms";
import styles from "./SPPoolsTableHead.module.scss";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

function SPValidatorTableHead(props:any) {
  return (
    <div className={styles.root}>
      <div className={c(styles.col_2_6, styles.validator)}>
        <Typography variant={"body2"} fontWeight={"bold"}>
          Validators {Object.keys(props?.validatorStakingInfoMap).length != 0 ? "(" + Object.keys(props?.validatorStakingInfoMap).length + ")" : ""}
        </Typography>
      </div>
      <div className={styles.col_2_4}>
        <Typography variant={"body2"} fontWeight={"bold"}>
          APR
        </Typography>
        <Tooltip
          title={tooltips.validatorAPR}
          classes={{ tooltip: "tooltip", arrow: "arrow" }}
          placement={"bottom"}
          arrow
        >
          <InfoOutlinedIcon className={"ml-2"} style={{ fontSize: 16 }} />
        </Tooltip>
      </div>
      <div className={styles.col_2_4}>
        <Typography variant={"body2"} fontWeight={"bold"}>
          Uptime
        </Typography>
      </div>
      <div className={styles.col_2_4}>
        <Typography variant={"body2"} fontWeight={"bold"}>
          Commission
        </Typography>
      </div>
      <div className={styles.col_2_4}>
        <Typography variant={"body2"} fontWeight={"bold"}>
          Voting Power
        </Typography>
      </div>
      <div className={styles.col_4} />
    </div>
  );
}

export default SPValidatorTableHead;