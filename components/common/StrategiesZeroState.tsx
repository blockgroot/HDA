import React from "react";
import { InfoOutlined } from "@material-ui/icons";
import WalletSelector from "../../stader-ui-lib/molecules/WalletSelector/WalletSelector";

function StrategiesZeroState(props: any) {
  // SHOW TOOLTIP with why this button was disabled

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="zeroState">
          <div>
            <InfoOutlined className="infoIcon" />
          </div>
          <div className="zeroStateContent">
            <p className="header">Wallet not connected!</p>
            <p className="text">
              To view strategies, please connect your wallet.
            </p>
            <div className={"mt-6"}>
              <WalletSelector variant={"solid"} size={"large"} />
            </div>
            {/*<SDButton*/}
            {/*	className="button"*/}
            {/*	onClick={() => {*/}
            {/*		const element = document.getElementById("#connectbutton");*/}
            {/*		element?.scrollIntoView({*/}
            {/*			behavior: "smooth",*/}
            {/*			block: "end",*/}
            {/*			inline: "nearest",*/}
            {/*		});*/}
            {/*		props.toggleConnectWallet(true);*/}
            {/*	}}*/}
            {/*	text="Connect Wallet"*/}
            {/*/>*/}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StrategiesZeroState;
