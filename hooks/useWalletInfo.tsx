import {
  Connection,
  ConnectType,
  useWallet,
  WalletStatus,
} from "@terra-money/wallet-provider";
import { config } from "../config/config";
import { useEffect, useState } from "react";
import { LCDClient } from "@terra-money/terra.js";
import {
  demicrofy,
  formatUSTWithPostfixUnits,
  truncate,
} from "@anchor-protocol/notation";
import { useAppContext } from "../libs/appContext";

const useWalletInfo = () => {
  // const createTerraWalletURL = "chrome-extension://aiifbnbfobpmeekipheeijimdpnlpgpp/index.html#/auth/new";
  const { updateWalletBalance } = useAppContext();
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [ustWalletBalance, setUstWalletBalance] = useState<string>("0");

  const terra = new LCDClient({
    URL: config.network.fcd,
    chainID: config.network.chainID,
  });

  const { wallets, status, disconnect, ...wallet } = useWallet();

  const walletAddress: string = wallets.length ? wallets[0].terraAddress : "";
  const truncatedWalletAddress: string = truncate(walletAddress);

  function walletBalanceByDenom(funds: any) {
    const denoms: any = {};
    funds.map((fund: any) => {
      denoms[fund.denom.toLowerCase()] = fund.amount;
    });

    return denoms;
  }

  const getWalletFund = async (walletAddress: string) => {
    try {
      return await terra.bank.balance(walletAddress);
    } catch (e) {
      // console.log(e);
    }
  };

  const installWallet = (type: ConnectType) => {
    wallet.install(type);
  };

  const connectWallet = (type: Connection) => {
    try {
      wallet.connect(type.type, type.identifier);
    } catch (err: any) {
      alert("Please install Tera Station extension correctly");
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const installTerraStation = () => {
    window.open(config.terraStationExtensionURL, "_blank");
  };
  useEffect(() => {
    if (status === WalletStatus.WALLET_CONNECTED && walletAddress) {
      getWalletFund(walletAddress).then((res) => {
        const { uluna, uusd } = walletBalanceByDenom(res);

        if (uluna) {
          setWalletBalance(formatUSTWithPostfixUnits(demicrofy(uluna)));
        } else {
          setWalletBalance("0");
        }

        if (uusd) {
          setUstWalletBalance(formatUSTWithPostfixUnits(demicrofy(uusd)));
        } else {
          setUstWalletBalance("0");
        }
      });
    }
  }, [status, walletAddress]);

  return {
    walletAddress,
    truncatedWalletAddress,
    walletBalance,
    disconnectWallet,
    connectWallet,
    installTerraStation,
    installWallet,
    ustWalletBalance,
  };
};

export default useWalletInfo;
