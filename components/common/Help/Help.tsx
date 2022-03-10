import HelpIcon from "@material-ui/icons/HelpOutline";
import c from "classnames";
import { useRouter } from "next/router";
import React from "react";
import { urls } from "../../../constants/constants";
import styles from "./Help.module.scss";

interface Props {
  className?: string;
}

const Help: React.FC<Props> = ({ className }: Props) => {
  const router = useRouter();
  // SHOW TOOLTIP with why this button was disabled
  const getFaqLink = (): string => {
    const pathname = router.pathname;
    if (pathname.indexOf("lt") > -1) {
      return urls.faqLiquidStaking;
    }

    return urls.faqPlainStaking;
  };

  return (
    <div className={c(styles.helpButtonContainer, className)}>
      <a
        href={getFaqLink()}
        target="_blank"
        rel="noreferrer"
        className={styles.helpButton}
      >
        <HelpIcon color="inherit" />
        <p className={styles.helpButtonText}>Get Help</p>
      </a>
    </div>
  );
};

export default Help;
