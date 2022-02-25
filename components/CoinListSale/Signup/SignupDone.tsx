import React from "react";
import SuccessTick from "../../../assets/svg/success_tick.svg";
import GradientBtnWithArrow from "../../common/GradientLinkWithArrow";
import YellowInfoText from "../../common/YellowInfoText";
import COINLIST_SALE_CONSTANTS from "../constants";

interface ISignupDoneProps {
  onEditRequest: () => void;
}
const SignupDone: React.FC<ISignupDoneProps> = ({ onEditRequest }) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2em",
      }}
    >
      <div>
        <img src={SuccessTick} alt="Signup done" width={80} />
      </div>
      <p
        style={{
          fontWeight: 600,
          fontSize: "18px",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        You have already registered for CoinList Sale Priority Queue
      </p>
      <div className="d-flex flex-wrap">
        <p style={{ marginBottom: 0, fontSize: "16px" }}>
          Need to edit your signup details ?
        </p>
        <GradientBtnWithArrow onClick={onEditRequest}>
          Re-register
        </GradientBtnWithArrow>
      </div>
      <div style={{ textAlign: "left" }}>
        <YellowInfoText
          style={{ marginBottom: "0.5em", fontSize: "14px", fontWeight: 600 }}
        >
          Registration will end on {COINLIST_SALE_CONSTANTS.registrationEndTime}
        </YellowInfoText>
        <YellowInfoText
          style={{ marginBottom: "0.5em", fontSize: "14px", fontWeight: 600 }}
        >
          {COINLIST_SALE_CONSTANTS.disclaimer}
        </YellowInfoText>
      </div>
    </div>
  );
};

export default SignupDone;
