import React from "react";
import { useRouter } from "next/router";
import HelpIcon from "@material-ui/icons/HelpOutline";
import c from "classnames";

import { urls } from "constants/constants";
import styles from "./Help.module.scss";

function HelpBtn() {
  const router = useRouter();
  const isLiquidStaking = router.pathname.indexOf("lt") > -1;

  return (
    <div className={c(styles.helpButtonContainer)}>
      <a
        href={isLiquidStaking ? urls.faqLiquidStaking : urls.faqPlainStaking}
        target="_blank"
        rel="noreferrer"
        className={styles.helpButton}
      >
        <HelpIcon color="inherit" />
        <p className={styles.helpButtonText}>Get Help</p>
      </a>
    </div>
  );
}

export default HelpBtn;
