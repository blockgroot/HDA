import React from "react";
import welcome_wave from "../../assets/svg/welcome_wave.svg";
import WalletSelector from "../../stader-ui-lib/molecules/WalletSelector/WalletSelector";

// TODO: move the styling to a style page
interface Props {
  toggleConnectWallet?: any;
}

function WelcomeScreenPoolLiquidStaking({ toggleConnectWallet }: Props) {
  return (
    <div className="welcome-container welcome-container-liquid-staking">
      <div className="welcome-content">
        <img src={welcome_wave} alt="welcome" />
        <h3 className="welcome-main-text">
          Hi there, welcome to the Stader community :)
        </h3>
        <div className="layout-column layout-align-center-center">
          <p className="welcome-sub-text">
            Please connect your wallet to experience Xtreme Liquidity with
            HbarX!
          </p>
          <div className={"mt-16"}>
            <WalletSelector variant={"solid"} />
          </div>
          {/*<SDButton*/}
          {/*	className="welcome-page-button"*/}
          {/*	onClick={() => toggleConnectWallet(true)}*/}
          {/*	text="Connect Wallet"*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreenPoolLiquidStaking;
