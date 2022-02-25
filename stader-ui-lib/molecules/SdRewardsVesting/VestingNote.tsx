import React from "react";
import WhiteInfoIcon from "../../assets/svg/info_icon_white.svg";
import Link from "@atoms/Link/Link";
import { COIN_LIST_SALE_CONSTANTS } from "@constants/coin-list-sale";

const VestingNote = () => {
  return (
    <div className="flex flex-row items-center mt-3 flex-wrap">
      <div className="flex flex-row justify-center items-center">
        <img src={WhiteInfoIcon} alt="Vesting Note" width={14} />
        <p
          style={{ fontWeight: 600, margin: "0 5px 0 5px", fontSize: "0.9em" }}
        >
          Vesting schedule of the SD tokens after TGE remains same as
          communicated earlier.{" "}
        </p>
      </div>
      <Link
        variant={"gradient"}
        href={COIN_LIST_SALE_CONSTANTS.coinListSdRewardsUpdateUrl}
        target={"_blank"}
      >
        Learn more
      </Link>
    </div>
  );
};

export default VestingNote;
