import React from "react";
import { Box, Typography } from "../../atoms";
import styles from "./ValidatorsTable.module.scss";

export interface Props {
  validators: any;
}

export default function ValidatorsTable({ validators = [] }: Props) {
  const headers = ["Validators", "Uptime", "Self-Delegation"];
  return (
    <Box noShadow className={styles.main}>
      <div className={"grid grid-cols-3 mb-2"}>
        {headers.map((header, index) => (
          <Typography
            fontWeight={"semi-bold"}
            key={header}
            className={`text-light-800 ${index !== 0 ? "text-center" : ""} ${
              styles.th
            }`}
            variant={"body2"}
          >
            {header}
          </Typography>
        ))}
      </div>

      <div className={styles.tbody}>
        {validators.map((validator: any) => (
          <React.Fragment key={validator.operatorAddress}>
            <Typography
              className={styles.validator_text}
              color={"textSecondary"}
              variant={"body3"}
              fontWeight={"medium"}
            >
              {validator.description.moniker}
            </Typography>
            <Typography
              className={`${styles.validator_text} text-center`}
              color={"textSecondary"}
              variant={"body3"}
              fontWeight={"medium"}
            >
              {(parseFloat(validator.upTime) * 100).toFixed()}%
            </Typography>
            <Typography
              className={`${styles.validator_text} text-center`}
              color={"textSecondary"}
              variant={"body3"}
              fontWeight={"medium"}
            >
              {(parseFloat(validator.selfDelegation.weight) * 100).toFixed(2)}%
            </Typography>
          </React.Fragment>
        ))}
      </div>
    </Box>
  );
}
