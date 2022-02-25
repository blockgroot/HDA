import React from "react";
import GradientBtnWithArrow from "../common/GradientLinkWithArrow";
import router from "next/router";

const VestingMainText = () => {
  return (
    <p>
      We are thrilled to announce that on January 25th, Stader will become the
      first protocol on Terra to do a sale on CoinList.
      <GradientBtnWithArrow onClick={() => router.push("/coinlist-sale")}>
        {" "}
        Learn more
      </GradientBtnWithArrow>
    </p>
  );
};

export default VestingMainText;
