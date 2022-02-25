import { demicrofy, formatLuna, truncate } from "@anchor-protocol/notation";

import { FC, useCallback } from "react";
import useClipboard from "react-use-clipboard";
import copy_address from "../../assets/svg/copy_address.svg";
import CheckIcon from "@material-ui/icons/Check";

import styles from "./WalletDetailContent.module.scss";

interface Props {
  className?: any;
  walletFunds?: any;
  wallet: any;
  disconnectWallet?: any;
  closePopup?: any;
}

const WalletDetailContent: FC<Props> = ({
  walletFunds,
  wallet,
  disconnectWallet,
}) => {
  const primaryWalletAddress = wallet.wallets[0].terraAddress;
  const [isCopied, setCopied] = useClipboard(primaryWalletAddress, {
    successDuration: 1000 * 6,
  });

  const viewOnTerraFinder = useCallback(() => {
    window.open(
      `https://finder.terra.money/${wallet.network.chainID}/account/${primaryWalletAddress}`,
      "_blank"
    );
  }, [wallet.network.chainID, primaryWalletAddress]);

  return (
    <>
      <div className={styles.walletLineItem}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{truncate(primaryWalletAddress)}</span>
          {isCopied && (
            <CheckIcon
              fontSize="small"
              style={{
                color: "green",
                verticalAlign: "sub",
                marginRight: "10px",
              }}
            />
          )}
        </div>
        <img alt="img" src={copy_address} onClick={setCopied} />
      </div>
      <div
        className={styles.walletLineItem}
        style={{ borderBottom: "1px solid #2E2E2E" }}
      >
        <span>LUNA</span>
        <span>
          {!!walletFunds && !!walletFunds.uluna
            ? formatLuna(demicrofy(walletFunds.uluna))
            : 0}
        </span>
      </div>

      <button className={styles.disconnect} onClick={disconnectWallet}>
        Disconnect Wallet
      </button>
    </>
  );
};

export default WalletDetailContent;
