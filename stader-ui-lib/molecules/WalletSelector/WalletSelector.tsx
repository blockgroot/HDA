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
import useHashConnect from "@hooks/useHashConnect";

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
  const {
    connect,
    walletData,
    installedExtensions,
    associateToken,
    accountInfo,
    status,
  } = useHashConnect();

  const { accountIds, network, id } = walletData;

  const wallet: any = useWallet();
  const {
    truncatedWalletAddress,
    walletAddress,
    disconnectWallet,
    connectWallet,
    installWallet,
  } = useWalletInfo();

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
        {accountInfo?.accountId.toString()}
      </Typography>
      <div className={styles.divider} />
      <Typography variant={"body2"} fontWeight={"bold"} className={"mr-1"}>
        {console.log(accountInfo?.balance.toString())}
        {accountInfo?.balance.toString()}
      </Typography>
      {/* <Typography variant={"body3"} fontWeight={"bold"} className={"inline"}>
        HBAR
      </Typography> */}
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
        onClick={connect}
        size={size || "small"}
        id="wallet-button"
      >
        {props.children}
      </Button>
    );
  };

  const renderWalletButton = useCallback(() => {
    // console.log("accountInfo", accountInfo?.balance.hbars?.toString());
    if (isWalletInitializing) {
      return <WalletButton>Initializing Wallet...</WalletButton>;
    }
    if (isWalletDisconnected) {
      return <WalletButton>Connect Wallet</WalletButton>;
    }
    return <WalletButton>{walletButtonElements}</WalletButton>;
  }, [status, walletBalance]);

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
  }, [status, walletBalance]);

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
