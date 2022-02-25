import React from "react";
import YellowInfoText from "../../../common/YellowInfoText";
import COINLIST_SALE_CONSTANTS from "../../constants";

export function SignupNote() {
  return (
    <div>
      <YellowInfoText
        style={{ margin: "0 0 0 1em", fontSize: "14px", fontWeight: 600 }}
      >
        Registration will end on {COINLIST_SALE_CONSTANTS.registrationEndTime}
      </YellowInfoText>
      <YellowInfoText
        style={{ margin: "0 0 0 1em", fontSize: "14px", fontWeight: 600 }}
      >
        You will be considered for the Priority Queue only if you meet the
        eligibility criteria & complete registration on CoinList
      </YellowInfoText>
      <YellowInfoText
        style={{ margin: "0 0 0 1em", fontSize: "14px", fontWeight: 600 }}
      >
        {COINLIST_SALE_CONSTANTS.disclaimer}
      </YellowInfoText>
    </div>
  );
}
