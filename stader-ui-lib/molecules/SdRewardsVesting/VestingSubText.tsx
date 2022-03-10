import React from "react";
import { NATIVE_TOKEN_LABEL, urls } from "@constants/constants";
import Link from "@atoms/Link/Link";
import styles from "./SdRewardsVesting.module.scss";

interface IVestingSubTextProps {
  isLiquidStaking?: boolean;
}

const VestingSubText: React.FC<IVestingSubTextProps> = ({
  isLiquidStaking,
}) => {
  return (
    <ul className={styles.list}>
      <li className="mx-2 my-4">
        As an early Staker you were able to farm SD tokens close to our seed
        sale price.
      </li>
      <li className="mx-2 my-4">
        Due to legal and regulatory constraints, we can only do the SD Token
        Generating Event (TGE) 40 days after the sale.
      </li>
      <li className="mx-2 my-4">
        As a reward for your support in continuing to retain farmed rewards
        until TGE,
        <p style={{ color: "#00DBFF" }}>
          Stader is offering an APY of 50% on the vested SD rewards till TGE.
        </p>
      </li>
      {!isLiquidStaking && (
        <li className="mx-2 my-3">
          Undelegating {NATIVE_TOKEN_LABEL} before July 20, 2022 leads to only 50% of the
          unvested SD rewards to vest.
          <Link
            href={urls.cfAnnouncementLink}
            target={"_blank"}
            variant={"gradient"}
            className={"inline"}
          >
            Learn More
          </Link>
        </li>
      )}
    </ul>
  );
};

export default VestingSubText;
