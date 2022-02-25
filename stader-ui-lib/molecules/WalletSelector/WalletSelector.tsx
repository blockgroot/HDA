import React, { FC, useCallback, useState } from "react";
import { ClickAwayListener, Popper } from "@material-ui/core";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { Button, Typography } from "../../atoms";
import { ConnectedWalletModal, DisconnectWalletModal } from "./WalletModals";
import styles from "./WalletSelector.module.scss";
import Icon from "../../atoms/Icon/Icon";
import useWalletInfo from "../../../hooks/useWalletInfo";
import { useAppContext } from "../../../libs/appContext";
import greenTick from "../../assets/svg/check_success.svg";
import { CheckCircle, Info } from "@material-ui/icons";
import classNames from "classnames";

const WalletSelector = ({
  variant,
  size,
  iconOnly,
}: {
  variant?: any;
  size?: any;
  iconOnly?: boolean;
}) => {
  const [modal, setModal] = useState<{ open: boolean; anchorEl: any }>({
    open: false,
    anchorEl: null,
  });
  const { walletBalance } = useAppContext();

  const wallet: any = useWallet();
  const {
    truncatedWalletAddress,
    walletAddress,
    disconnectWallet,
    connectWallet,
    installWallet,
  } = useWalletInfo();

  const isWalletConnected: boolean =
    wallet.status === WalletStatus.WALLET_CONNECTED;
  const isWalletInitializing: boolean =
    !wallet || wallet.status === WalletStatus.INITIALIZING;
  const isWalletDisconnected: boolean =
    wallet.wallets.length === 0 ||
    wallet.status === WalletStatus.WALLET_NOT_CONNECTED;

  const openModal = (e: any) => {
    setModal({ open: true, anchorEl: e.currentTarget });
  };
  const closeModal = () => {
    setModal({ open: false, anchorEl: null });
  };

  const walletButtonElements = (
    <>
      <Typography
        variant={"body2"}
        fontWeight={"medium"}
        className={"inline ml-4 capitalize"}
      >
        {truncatedWalletAddress}
      </Typography>
      <div className={styles.divider} />
      <Typography variant={"body2"} fontWeight={"bold"} className={"mr-1"}>
        {walletBalance}
      </Typography>
      <Typography variant={"body3"} fontWeight={"bold"} className={"inline"}>
        LUNA
      </Typography>
    </>
  );

  const connectedWalletModal = (
    <ConnectedWalletModal
      walletBalance={walletBalance}
      disconnectWallet={disconnectWallet}
      walletAddress={walletAddress}
      truncatedWalletAddress={truncatedWalletAddress}
    />
  );

  const disconnectWalletModal = (
    <DisconnectWalletModal
      connectWallet={connectWallet}
      installWallet={installWallet}
    />
  );

  const WalletButton: FC = (props) => {
    return (
      <Button
        variant={variant || "outlined"}
        icon={
          <div className={styles.wallet_icon}>
            {walletAddress && (
              <img
                alt=""
                src={greenTick}
                width="10"
                className={styles.wallet_connected_badge}
              />
            )}
            <Icon name={"wallet"} height={20} width={20} />
          </div>
        }
        className={"px-4 items-center flex"}
        onClick={openModal}
        size={size || "small"}
        id="wallet-button"
      >
        {props.children}
      </Button>
    );
  };

  const renderWalletButton = useCallback(() => {
    if (isWalletInitializing) {
      return <WalletButton>Initializing Wallet...</WalletButton>;
    }
    if (isWalletDisconnected) {
      return <WalletButton>Connect Wallet</WalletButton>;
    }
    return <WalletButton>{walletButtonElements}</WalletButton>;
  }, [wallet.status, walletBalance]);

  const iconOnlyWalletButton = useCallback(() => {
    // if(isWalletInitializing){
    return (
      <div className={styles.icon_only_wallet} onClick={openModal}>
        <Icon name={"wallet"} height={20} width={20} />
        {isWalletConnected && (
          <CheckCircle
            className={classNames(
              styles.badge_icon,
              styles.badge_wallet_connected
            )}
          />
        )}
        {isWalletDisconnected && (
          <Info
            className={classNames(
              styles.badge_icon,
              styles.badge_wallet_disconnected
            )}
          />
        )}
      </div>
    );
    // }
  }, [wallet.status, walletBalance]);

  return (
    <div style={{ position: "relative" }}>
      <div>{iconOnly ? iconOnlyWalletButton() : renderWalletButton()}</div>

      {modal.open && (
        <ClickAwayListener onClickAway={closeModal}>
          <div className={styles.wallet_dropdown_container}>
            <WalletDropDown>
              {isWalletConnected && connectedWalletModal}
              {isWalletDisconnected && disconnectWalletModal}
            </WalletDropDown>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default WalletSelector;

const WalletDropDown: FC = (props) => {
  const { children } = props;
  return <div className={`${styles.dropdown_box} bg-dark-50`}>{children}</div>;
};
