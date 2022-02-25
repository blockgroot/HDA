import React from "react";
import { Close, InfoOutlined } from "@material-ui/icons";
import c from "classnames";

import styles from "./Banner.module.scss";
import { LT_BANNER_TEXT } from "@constants/constants";

interface Props {
  activePage: string;
  onClose: () => void;
}

function Banner({ activePage, onClose = () => {} }: Props) {
  const isLiquidStaking = activePage.indexOf("lt") > -1;

  return (
    <div
      className={c(
        styles.bannerContent,
        "d-flex flex-row justify-content-center align-items-center",
        isLiquidStaking && styles.ltBannerContent
      )}
    >
      <div className="d-flex flex-row justify-content-center align-items-center">
        <InfoOutlined className={`${styles.infoIcon} mx-2`} />
        <p className={`mb-0 ${styles.bannerContentText}`}>
          {isLiquidStaking
            ? LT_BANNER_TEXT
            : "3 Million SD tokens have been farmed. Maximize your Luna with auto-compounding on Stader."}
        </p>
      </div>
      <button className={styles.closeBtn} onClick={onClose}>
        <Close color="inherit" />
      </button>
    </div>
  );
}

export default Banner;
