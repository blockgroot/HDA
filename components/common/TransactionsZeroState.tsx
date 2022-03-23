import React from "react";
import { InfoOutlined } from "@material-ui/icons";
import SDButton from "./SDButton";

function TransactionsZeroState(props: any) {
  // SHOW TOOLTIP with why this button was disabled

  return (
    <div className="zeroState">
      <div>
        <InfoOutlined className="infoIcon" />
      </div>
      <div className="zeroStateContent">
        <p className="header">
          {props.primaryWalletAddress && props.primaryWalletAddress !== ""
            ? "Hey, you haven’t made any transactions yet!"
            : "Wallet not connected!"}
        </p>
        {props.primaryWalletAddress &&
        props.primaryWalletAddress !== "" ? null : (
          <p className="text">
            To view transactions, please connect your wallet.
          </p>
        )}
        {props.primaryWalletAddress &&
        props.primaryWalletAddress !== "" ? null : (
          <SDButton
            className="button"
            onClick={() => {
              const element = document.getElementById("#connectbutton");
              element?.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              });
              props.toggleConnectWallet(true);
            }}
            text="Connect Wallet"
          />
        )}
      </div>
    </div>
  );
}

export default TransactionsZeroState;
