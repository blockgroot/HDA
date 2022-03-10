import React, { ReactNode } from "react";
import { Typography } from "../../atoms";
import styles from "./SPManageHoldingNativeTokenLists.module.scss";
import { NATIVE_TOKEN_LABEL } from "@constants/constants";

interface Props {
  label: ReactNode;
  value: string | number;
  button: ReactNode;
}

export default function SPManageHoldingNativeTokenLists({
  label,
  value,
  button,
}: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.sub_row}>
        <div className={styles.title_wrap}>{label}</div>
        <div className={styles.total}>
          <Typography variant="h2" fontWeight="medium" className={styles.value}>
            {value}
          </Typography>
          <Typography variant="body2">{NATIVE_TOKEN_LABEL}</Typography>
        </div>
      </div>
      {button}
    </div>
  );
}
