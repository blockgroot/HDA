import useHashConnect from "@hooks/useHashConnect";
import { Button, IconButton, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import welcome_wave from "../../assets/svg/welcome_wave.svg";
import { config } from "config/config";
import WalletSelector from "../../stader-ui-lib/molecules/WalletSelector/WalletSelector";

// TODO: move the styling to a style page
interface Props {
  toggleConnectWallet?: any;
}

function WelcomeScreenPoolLiquidStaking({ toggleConnectWallet }: Props) {
  const { installedExtensions } = useHashConnect();

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const time = setTimeout(() => {
      console.log();
      if (installedExtensions === null) {
        setOpen(true);
      }
    }, 5000);
    return () => clearTimeout(time);
  }, [installedExtensions]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        INSTALL
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      ></IconButton>
    </React.Fragment>
  );

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
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        action={action}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          wallet extension not found, Click
          <a href={config.extension_url} target="_blank" rel="noreferrer">
            here
          </a>
          to install the official Hashpack extension
        </Alert>
      </Snackbar>
    </div>
  );
}

export default WelcomeScreenPoolLiquidStaking;
