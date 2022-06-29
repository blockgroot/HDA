import useHashConnect from "@hooks/useHashConnect";
import { Button, IconButton, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import welcome_wave from "../../assets/svg/welcome_wave.svg";
import { config } from "config/config";
import WalletSelector from "../../stader-ui-lib/molecules/WalletSelector/WalletSelector";
import {
  MQ_FOR_TABLET_LANDSCAPE,
  MQ_FOR_PHONE,
} from "@constants/media-queries";
import { Grid, useMediaQuery } from "@material-ui/core";

// TODO: move the styling to a style page
interface Props {
  toggleConnectWallet?: any;
}

function WelcomeScreenPoolLiquidStaking({ toggleConnectWallet }: Props) {
  const tabletDown = useMediaQuery(`(max-width:${MQ_FOR_TABLET_LANDSCAPE}px)`);
  const mobileDown = useMediaQuery(`(max-width:${MQ_FOR_PHONE}px)`);

  return (
    <div
      className={`welcome-container welcome-container-liquid-staking ${
        tabletDown || mobileDown ? "" : "pl-4 pr-4"
      } `}
    >
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
        <div className="flex-auto flex-col-reverse pt-4">
          <div>
            <WalletSelector variant={"solid"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreenPoolLiquidStaking;
