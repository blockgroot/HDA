import React, { FC } from "react";
import useClipboard from "react-use-clipboard";
import Divider from "../../atoms/Divider/Divider";
import { Button, Typography } from "../../atoms";
import ListItem from "../../atoms/ListItem/ListItem";
import {
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
  urls,
} from "@constants/constants";
import styles from "./WalletSelector.module.scss";

import copy_address from "../../../assets/svg/copy_address.svg";
import CheckIcon from "@material-ui/icons/Check";
import { ConnectType } from "context/HashConnectProvider";

type WailetsConfig = {
  availableInstallTypes: Array<ConnectType>;
};
interface ConnectedProps {
  disconnectWallet: () => void;
  walletBalance: number;
  truncatedWalletAddress: string;
  walletAddress: string;
}

export const ConnectedWalletModal: FC<ConnectedProps> = (props) => {
  const {
    walletAddress,
    walletBalance,
    truncatedWalletAddress,
    disconnectWallet,
  } = props;

  const [isCopied, setCopied] = useClipboard(walletAddress, {
    successDuration: 1000 * 6,
  });

  return (
    <>
      <ListItem className={"mb-4"}>
        <div className={"flex items-center"}>
          <Typography fontWeight={"bold"} variant={"body2"}>
            {truncatedWalletAddress}
          </Typography>
          {isCopied && (
            <CheckIcon
              fontSize="small"
              style={{
                color: "green",
              }}
            />
          )}
        </div>

        <img alt="img" src={copy_address} onClick={setCopied} />
      </ListItem>
      <Divider color={"gradient"} />
      <ListItem className={"py-4"}>
        <Typography fontWeight={"bold"} variant={"body2"}>
          {NATIVE_TOKEN_LABEL}
        </Typography>
        <Typography fontWeight={"bold"} variant={"body2"}>
          {walletBalance / NATIVE_TOKEN_MULTIPLIER}
        </Typography>
      </ListItem>
      <Divider color={"light"} />

      <Button
        variant={"flat"}
        childClassName={"px-5"}
        parentClassName={"mt-4 self-center"}
        onClick={disconnectWallet}
        size={"small"}
      >
        Disconnect Wallet
      </Button>
    </>
  );
};

interface DisconnectedProps {
  installWallet: (props: ConnectType) => void;
}

export const DisconnectWalletModal: FC<DisconnectedProps> = (props) => {
  const { installWallet } = props;
  const wallet = useWallet();

  return (
    <>
      {wallet.availableInstallTypes.includes(ConnectType.CHROME_EXTENSION) && (
        <Button
          variant={"flat"}
          childClassName={"px-5"}
          parentClassName={"w-full"}
          onClick={() => installWallet(ConnectType.CHROME_EXTENSION)}
          size={"small"}
        >
          <Typography fontWeight={"medium"}>HashPack Wallet</Typography>
        </Button>
      )}
      <Button
        variant={"flat"}
        childClassName={"px-5"}
        parentClassName={"w-full"}
        onClick={() => installWallet(ConnectType.BLADE_WALLET)}
        size={"small"}
      >
        <Typography fontWeight={"medium"}>Blade Wallet</Typography>
      </Button>

      <Typography
        fontWeight={"bold"}
        className={"text-white mt-5 text-center"}
        variant={"caption1"}
      >
        By connecting a wallet, you agree to our{" "}
        <a
          href={urls.termsOfService}
          target="_blank"
          rel="noreferrer"
          className={styles.term_of_service}
        >
          Terms of Service
        </a>
      </Typography>
    </>
  );
};

function useWallet(): WailetsConfig {
  return {
    availableInstallTypes: [ConnectType.CHROME_EXTENSION],
  };
}
