import React from "react";
import GradientBtnWithArrow from "../../../common/GradientLinkWithArrow";
import COINLIST_SALE_CONSTANTS from "../../constants";

export function MoreInfoAboutSaleOptions() {
  return (
    <p className="mt-1 mb-0">
      Learn more about the options here
      <GradientBtnWithArrow
        onClick={() =>
          window.open(COINLIST_SALE_CONSTANTS.staderCoinlistLink, "_blank")
        }
      >
        Sale Options
      </GradientBtnWithArrow>
    </p>
  );
}
