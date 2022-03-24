import React, { FC, useCallback, useState } from "react";
import { ClickAwayListener } from "@material-ui/core";

import { Button, Typography } from "../../atoms";
import styles from "./WalletSelector.module.scss";
import Icon from "../../atoms/Icon/Icon";

import greenTick from "../../assets/svg/check_success.svg";
import { CheckCircle, Info } from "@material-ui/icons";
import classNames from "classnames";
import {
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
  precision,
} from "@constants/constants";
import useHashConnect from "@hooks/useHashConnect";
import useAccount from "@hooks/useUserAccount";
import { ConnectedWalletModal, DisconnectWalletModal } from "./WalletModals";
import { ConnectType } from "context/HashConnectProvider";

export const WalletStatus = {
  WALLET_CONNECTED: "WALLET_CONNECTED",
  INITIALIZING: "INITIALIZING",
  WALLET_NOT_CONNECTED: "WALLET_NOT_CONNECTED"
  
};

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

  const {
    connect,
    disconnect,
    accountBalance,
    selectedAccount,
    walletData: saveData,
    network: network,
    installedExtensions,
    status,
    stake,
    tvl,
  } = useHashConnect();

  const { hbarX, hbar } = useAccount();

  const isWalletConnected: boolean = status === WalletStatus.WALLET_CONNECTED;
  const isWalletInitializing: boolean = status === WalletStatus.INITIALIZING;
  const isWalletDisconnected: boolean =
    status === WalletStatus.WALLET_NOT_CONNECTED;

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
        {selectedAccount}
      </Typography>
      <div className={styles.divider} />
      <Typography variant={"body2"} fontWeight={"bold"} className={"mr-1"}>
        {(hbar / NATIVE_TOKEN_MULTIPLIER).toFixed(precision)}
      </Typography>
      <Typography variant={"body3"} fontWeight={"bold"} className={"inline"}>
        {NATIVE_TOKEN_LABEL}
      </Typography>
    </>
  );

  const connectedWalletModal = (
    <ConnectedWalletModal
      walletBalance={hbar}
      disconnectWallet={() => {
        closeModal();
        disconnect();
      }}
      walletAddress={selectedAccount}
      truncatedWalletAddress={selectedAccount}
    />
  );

  const disconnectWalletModal = (
    <DisconnectWalletModal
      installedExtensions={installedExtensions}
      isWalletInitializing={isWalletInitializing}
      isWalletDisconnected={isWalletDisconnected}
      installWallet={(type: ConnectType) => {
        closeModal();
        connect(type);
      }}
    />
  );

  const WalletButton: FC = (props) => {
    return (
      <Button
        variant={variant || "outlined"}
        icon={
          <div className={styles.wallet_icon}>
            <img
              alt=""
              src={greenTick}
              width="10"
              className={styles.wallet_connected_badge}
            />

            <Icon name={"wallet"} height={20} width={20} />
          </div>
        }
        className={"px-4 items-center flex"}
        onClick={openModal}
        // onClick={() => {
        //   if (!isWalletConnected) connect();
        // }}
        size={size || "small"}
        id="wallet-button"
      >
        {props.children}
      </Button>
    );
  };

  const renderWalletButton = useCallback(() => {
    // if (isWalletInitializing) {
    //   return <WalletButton> Initializing Wallet...</WalletButton>;
    // }
    if (isWalletDisconnected || isWalletInitializing) {
      return <WalletButton> Connect Wallet</WalletButton>;
    }
    return <WalletButton>{walletButtonElements}</WalletButton>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div style={{ position: "relative" }}>
      <div>{iconOnly ? iconOnlyWalletButton() : renderWalletButton()}</div>

      {modal.open && (
        <ClickAwayListener onClickAway={closeModal}>
          <div className={styles.wallet_dropdown_container}>
            <WalletDropDown>
              {isWalletConnected && connectedWalletModal}
              {!isWalletConnected && disconnectWalletModal}
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
