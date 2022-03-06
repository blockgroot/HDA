import React, { useCallback, useEffect, useState } from "react";
import { ClickAwayListener } from "@material-ui/core";
import {
  WalletStatus,
  ConnectType,
  useWallet,
  Connection,
} from "@terra-money/wallet-provider";

import WalletDetailContent from "../anchorComps/WalletDetailContent";
import WalletButton from "../common/WalletButton";
import { config } from "../../config/config";
import { urls } from "../../constants/constants";

import styles from "./WalletSelector.module.scss";

interface Props {
  walletFunds?: any;
  walletDialog?: any;
  toggleConnectWallet?: any;
}

const WalletSelector = ({
  walletFunds,
  walletDialog,
  toggleConnectWallet,
}: Props) => {
  // const createTerraWalletURL = "chrome-extension://aiifbnbfobpmeekipheeijimdpnlpgpp/index.html#/auth/new";
  const [open, setOpen] = useState(false);
  const wallet = useWallet();

  useEffect(() => {
    if (walletDialog) {
      toggleOpen();
    }
  }, [walletDialog]);

  const installWallet = useCallback(
    (type: ConnectType) => {
      wallet.install(type);
      setOpen(false);
    },
    [wallet.connect]
  );

  const connectWallet = useCallback(
    (type: Connection) => {
      wallet.connect(type.type, type.identifier);
      setOpen(false);
    },
    [wallet.connect]
  );

  const disconnectWallet = useCallback(() => {
    setOpen(false);
    wallet.disconnect();
    window.location.reload();
  }, [wallet.disconnect]);

  const installTerraStation = useCallback(() => {
    window.open(config.terraStationExtensionURL, "_blank");
    setOpen(false);
  }, []);

  // THIS DOES NOT WORK. MAYBE Security issue.
  // const createTerraWallet = useCallback(() => {
  // 	window.open(createTerraWalletURL, "_blank")
  // });

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const onClickAway = useCallback(() => {
    setOpen(false);
    toggleConnectWallet(false);
  }, []);

  const address =
    wallet && wallet.wallets && wallet.wallets.length > 0
      ? wallet.wallets[0].terraAddress
      : null;

  if (!wallet || wallet.status === WalletStatus.INITIALIZING) {
    return (
      <WalletButton disabled className={styles.walletConnect}>
        Initializing Wallet...
      </WalletButton>
    );
  }

  if (
    wallet.wallets.length === 0 ||
    wallet.status === WalletStatus.WALLET_NOT_CONNECTED
  ) {
    return (
      <ClickAwayListener onClickAway={onClickAway}>
        <div className={styles.walletConnectPosition} id="connectbutton">
          <WalletButton onClick={toggleOpen} className={styles.walletConnect}>
            Connect Wallet
          </WalletButton>
          {open && (
            <div className="dropdown-container">
              <div className={`dropdown-box ${styles.walletDropdown}`}>
                <div className={styles.walletContainer}>
                  {wallet.availableInstallTypes.includes(
                    ConnectType.CHROME_EXTENSION
                  ) && (
                    <button
                      onClick={() =>
                        installWallet(ConnectType.CHROME_EXTENSION)
                      }
                      className={styles.walletDropdownBtn}
                    >
                      Install Terra Station
                    </button>
                  )}

                  {wallet.availableConnections
                    .filter((t) => t.type != ConnectType.READONLY)
                    .map((type) => (
                      <button
                        onClick={() => connectWallet(type)}
                        className={styles.walletDropdownBtn2}
                        key={type.type}
                      >
                        {type.name}
                      </button>
                    ))}

                  <p className={styles.walletLinkText}>
                    By connecting a wallet, you agree to our{" "}
                    <a
                      href={urls.termsOfService}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.walletLinkItem}
                    >
                      Terms of Service
                    </a>{" "}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ClickAwayListener>
    );
  }

  return wallet.status === WalletStatus.WALLET_CONNECTED ? (
    <ClickAwayListener onClickAway={onClickAway}>
      <div className={styles.walletConnectPosition}>
        <WalletButton
          walletFunds={walletFunds}
          walletAddress={address}
          onClick={toggleOpen}
          className={styles.walletConnect}
        />
        {open && (
          <div className="dropdown-container">
            <div className={`dropdown-box ${styles.walletDropdown}`}>
              <div className={styles.walletContainer}>
                <WalletDetailContent
                  // bank={bank}
                  // status={status}
                  walletFunds={walletFunds}
                  wallet={wallet}
                  closePopup={() => setOpen(false)}
                  disconnectWallet={disconnectWallet}
                  // openSend={() => openSendDialog({})}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  ) : null;
};

export default WalletSelector;
