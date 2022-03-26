import React from "react";
import { Close, InfoOutlined } from "@material-ui/icons";
import c from "classnames";

import styles from "./Banner.module.scss";
import { NATIVE_TOKEN_LABEL } from "@constants/constants";

interface Props {
  activePage: string;
  onClose: () => void;
  message: string;
}

function Banner({ activePage, message, onClose = () => {} }: Props) {
  const isLiquidStaking = activePage.indexOf("lt") > -1;

  return (
    <div
      className={c(
        styles.bannerContent,
        isLiquidStaking && styles.ltBannerContent
      )}
    >
      <div className="flex justify-center items-center">
        <InfoOutlined className={`${styles.infoIcon} mx-2`} />
        <p className={`mb-0 ${styles.bannerContentText}`}>{message}</p>
      </div>
      <button className={styles.closeBtn} onClick={onClose}>
        <Close color="inherit" />
      </button>
    </div>
  );
}

export default Banner;
