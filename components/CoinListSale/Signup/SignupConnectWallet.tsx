import { ConnectType, useWallet } from "@terra-money/wallet-provider";
import React from "react";
import GradientBtnWithArrow from "../../common/GradientLinkWithArrow";

const SignupConnectWallet = () => {
  const wallet = useWallet();

  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <p
        style={{ fontSize: "18.67px", fontWeight: "bold", textAlign: "center" }}
      >
        To signup for coinlist, please connect your wallet
      </p>

      <GradientBtnWithArrow
        onClick={() => wallet.connect(ConnectType.CHROME_EXTENSION)}
        style={{ fontSize: "18px", display: "block" }}
      >
        Connect wallet
      </GradientBtnWithArrow>
    </div>
  );
};

export default SignupConnectWallet;
