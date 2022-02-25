import React from "react";
import GradientBtnWithArrow from "../../common/GradientLinkWithArrow";
import YellowInfoText from "../../common/YellowInfoText";
import COINLIST_SALE_CONSTANTS from "../constants";

interface ISignupSuccessProps {
  onEditRequest: () => void;
}
const SignupSuccess: React.FC<ISignupSuccessProps> = ({ onEditRequest }) => {
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
      <p
        style={{
          fontWeight: 600,
          fontSize: "18px",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        Congratulations! You have successfully Signed Up for CoinList Priority
        Queue
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
          {COINLIST_SALE_CONSTANTS.disclaimer}
        </YellowInfoText>
      </div>
    </div>
  );
};

export default SignupSuccess;
