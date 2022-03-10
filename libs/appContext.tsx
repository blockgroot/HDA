import {
  Context,
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { LCDClient } from "@terra-money/terra.js";
import { config } from "../config/config";
import { useWallet } from "@terra-money/wallet-provider";
import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from "@anchor-protocol/notation";
import { useQuery } from "react-query";
import { WALLET_BALANCES } from "@constants/queriesKey";
import { NATIVE_TOKEN_MULTIPLIER } from "@constants/constants";

type WalletBalancesType = {
  uNativeToken: number;
  uusd: number;
};

type AppContextType = {
  terra: any;
  walletAddress: string;
  walletBalance: string;
  ustWalletBalance: string;
  updateWalletBalance: () => void;
  nativeTokenBalance: number;
  ustBalance: number;
};

const terra = new LCDClient({
  URL: config.network.fcd,
  chainID: config.network.chainID,
});

const appContext: Context<AppContextType> = createContext({
  terra: {},
  walletAddress: "",
  walletBalance: "0",
  ustWalletBalance: "0",
  updateWalletBalance: () => {},
  nativeTokenBalance: 0,
  ustBalance: 0,
});

const AppProvider: FC = (props) => {
  const { wallets } = useWallet();
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [ustWalletBalance, setUstWalletBalance] = useState<string>("0");
  const [balances, setBalances] = useState({ nativeTokenBalance: 0, ustBalance: 0 });
  const walletAddress: string = wallets.length ? wallets[0].terraAddress : "";

  function walletBalanceByDenom(funds: any) {
    try {
      const denoms: any = {};
      funds.map((fund: any) => {
        denoms[fund.denom.toLowerCase()] = fund.amount;
      });

      return denoms;
    } catch (e) {
      throw e;
    }
  }

  const updateWalletBalance = async (walletAddress: string) => {
    try {
      let rawBalance = await terra.bank.balance(walletAddress);

      const { uNativeToken, uusd } = walletBalanceByDenom(rawBalance);

      return {
        uNativeToken: uNativeToken || 0,
        uusd: uusd || 0,
      };
    } catch (e) {
      throw new Error("An error occured: " + e);
    }
  };

  const walletBalancesQuery = useQuery<WalletBalancesType>(
    [WALLET_BALANCES, walletAddress],
    () => updateWalletBalance(walletAddress),
    {
      onSuccess: (res) => {
        const { uNativeToken, uusd } = res;
        setBalances({
          nativeTokenBalance: parseFloat((uNativeToken / NATIVE_TOKEN_MULTIPLIER).toFixed(6)),
          ustBalance: parseFloat((uusd / NATIVE_TOKEN_MULTIPLIER).toFixed(6)),
        });
        setUstWalletBalance(formatUSTWithPostfixUnits(demicrofy(uusd)));
        setWalletBalance(formatUSTWithPostfixUnits(demicrofy(uNativeToken)));
      },
      enabled: false,
    }
  );

  useEffect(() => {
    if (walletAddress) {
      walletBalancesQuery.refetch();
    }
  }, [walletAddress]);

  return (
    <appContext.Provider
      value={{
        terra,
        walletAddress,
        walletBalance,
        ustWalletBalance,
        updateWalletBalance: walletBalancesQuery.refetch,
        nativeTokenBalance: balances.nativeTokenBalance,
        ustBalance: balances.ustBalance,
      }}
    >
      {props.children}
    </appContext.Provider>
  );
};
const useAppContext = () => useContext(appContext);

export { AppProvider, useAppContext };
