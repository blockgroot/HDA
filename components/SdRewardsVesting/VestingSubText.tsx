import React from "react";
import { urls } from "../../constants/constants";
import GradientBtnWithArrow from "../common/GradientLinkWithArrow";

interface IVestingSubTextProps {
  isLiquidStaking?: boolean;
}
const VestingSubText: React.FC<IVestingSubTextProps> = ({
  isLiquidStaking,
}) => {
  return (
    <ul>
      <li className="mx-2 my-3">
        As an early Staker you were able to farm SD tokens close to our seed
        sale price.
      </li>
      <li className="mx-2 my-3">
        Due to legal and regulatory constraints, we can only do the SD Token
        Generating Event (TGE) 40 days after the sale.
      </li>
      <li className="mx-2 my-3">
        As a reward for your support in continuing to retain farmed rewards
        until TGE,
        <p style={{ color: "#00DBFF" }}>
          Stader is offering an APY of 50% on the vested SD rewards till TGE.
        </p>
      </li>
      {!isLiquidStaking && (
        <li className="mx-2 my-3">
          Undelegating Luna before July 20, 2022 leads to only 50% of the
          unvested SD rewards to vest.
          <GradientBtnWithArrow
            onClick={() => window.open(urls.cfAnnouncementLink, "_blank")}
            style={{ display: "block", margin: 0 }}
          >
            Learn More
          </GradientBtnWithArrow>
        </li>
      )}
    </ul>
  );
};

export default VestingSubText;
