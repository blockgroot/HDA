import React from "react";
import welcome_wave from "../../assets/svg/welcome_wave.svg";
import WalletSelector from "../../stader-ui-lib/molecules/WalletSelector/WalletSelector";

// TODO: move the styling to a style page
interface Props {
  toggleConnectWallet?: any;
}

function WelcomeScreenPools({ toggleConnectWallet }: Props) {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <img src={welcome_wave} alt="welcome" />
        <h3 className="welcome-main-text">
          Hi there, welcome to the Stader community :)
        </h3>
        <div className="layout-row layout-align-space-between-center">
          <p className="welcome-sub-text">
            Stader offers the most convenient and safest way to maximise <br />
            your returns on staking.
          </p>
          <WalletSelector variant={"solid"} />
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

export default WelcomeScreenPools;
