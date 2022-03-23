import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";
import { useMediaQuery } from "@material-ui/core";
import React from "react";
import welcome_wave from "../../assets/svg/welcome_wave.svg";
import WalletSelector from "../../stader-ui-lib/molecules/WalletSelector/WalletSelector";
import InfoPageMobile from './InfoPageMobile';
// TODO: move the styling to a style page
interface Props {
  toggleConnectWallet?: any;
}

function WelcomeScreenPoolLiquidStaking({ toggleConnectWallet }: Props) {
  const tabletDown = useMediaQuery(`(max-width:${MQ_FOR_TABLET_LANDSCAPE}px)`);
  
  if (tabletDown) {
    return <InfoPageMobile />;
  }

  return (
    <div className="welcome-container welcome-container-liquid-staking">
      <div className="welcome-content">
        <div>
          <img src={welcome_wave} alt="welcome" />
          <h3 className="welcome-main-text">
            Hi there, welcome to the Stader community :)
          </h3>
          <div className="layout-column layout-align-center-center">
            <p className="welcome-sub-text">
              Stader offers the most convenient and safest way to maximise your
              returns on staking. Please connect your wallet and start staking.
            </p>
          </div>
        </div>
        <div className="flex-auto flex-col-reverse">
          <div>
            <WalletSelector variant={"solid"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreenPoolLiquidStaking;
