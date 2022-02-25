import React from "react";
import WhiteInfoIcon from "../../assets/svg/info_icon_white.svg";
import COINLIST_SALE_CONSTANTS from "../CoinListSale/constants";
import GradientBtnWithArrow from "../common/GradientLinkWithArrow";
const VestingNote = () => {
  return (
    <div className="d-flex flex-row align-items-center mt-3 flex-wrap">
      <div className="d-flex flex-row justify-content-center align-items-center">
        <img src={WhiteInfoIcon} alt="Vesting Note" width={14} />
        <p
          style={{ fontWeight: 600, margin: "0 5px 0 5px", fontSize: "0.9em" }}
        >
          Vesting schedule of the SD tokens after TGE remains same as
          communicated earlier.{" "}
        </p>
      </div>
      <GradientBtnWithArrow
        style={{ margin: 0 }}
        onClick={() =>
          window.open(
            COINLIST_SALE_CONSTANTS.coinListSdRewardsUpdateUrl,
            "_blank"
          )
        }
      >
        Learn More
      </GradientBtnWithArrow>
    </div>
  );
};

export default VestingNote;
