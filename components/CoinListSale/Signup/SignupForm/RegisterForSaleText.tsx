import React from "react";
import GradientBtnWithArrow from "../../../common/GradientLinkWithArrow";
import COINLIST_SALE_CONSTANTS from "../../constants";

export function RegisterForSaleText() {
  return (
    <li>
      If you meet the eligibility criteria, please register for the CoinList
      Sale in case you haven’t
      <GradientBtnWithArrow
        onClick={() =>
          window.open(COINLIST_SALE_CONSTANTS.staderCoinlistLink, "_blank")
        }
        style={{ display: "inline-block", marginLeft: "0.5em" }}
      >
        Register here
      </GradientBtnWithArrow>
    </li>
  );
}
