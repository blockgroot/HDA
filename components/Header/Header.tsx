import React from "react";

import hamburger_icon from "../../assets/svg/hamburger_icon.svg";
import WalletSelector from "../WalletSelector";
import styles from "./Header.module.scss";

interface Props {
  walletFunds: any;
  walletDialog: any;
  toggleConnectWallet: any;
  onToggleSidebar?: (hide: Boolean) => void;
}

// This component gives the user option to navigate between vaults and dashboard
function Header({
  walletFunds,
  walletDialog,
  toggleConnectWallet,
  onToggleSidebar = () => {},
}: Props) {
  const handleSidebarToggle = () => {
    onToggleSidebar(false);
  };

  return (
    <div className={styles.headerBannerWrapper}>
      <div className={styles.header}>
        <a
          href="https://staderlabs.com"
          target="_blank"
          rel="noreferrer"
          className={styles.headerLogo}
        />

        <div className="hstack">
          <WalletSelector
            walletFunds={walletFunds}
            walletDialog={walletDialog}
            toggleConnectWallet={toggleConnectWallet}
          />

          <button className={styles.menuBtn} onClick={handleSidebarToggle}>
            <img alt={" "} src={hamburger_icon} height={20} width={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
