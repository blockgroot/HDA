import { useState, useEffect, useCallback } from "react";
import { LedgerId } from "@hashgraph/sdk";
import { config } from "../config/config";

type WalletStatus =
  | "INITIALIZING"
  | "WALLET_NOT_CONNECTED"
  | "WALLET_CONNECTED";

interface UseDAppConnectorReturn {
  connect: () => Promise<void>;
  signTransaction: (transactionString: string) => Promise<string | null>;
  status: WalletStatus;
  accountId: string | null;
  isConnecting: boolean;
  error: string | null;
}

const PROJECT_ID = "f891b15efe53e71351537c2c62cd024d";

export const useDAppConnector = (): UseDAppConnectorReturn => {
  const [status, setStatus] = useState<WalletStatus>("INITIALIZING");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dAppConnector, setDAppConnector] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;
    let connectionInterval: NodeJS.Timeout;

    const initializeDAppConnector = async () => {
      try {
        setStatus("INITIALIZING");

        // Dynamic import for client-side only
        const {
          DAppConnector,
          HederaChainId,
          HederaJsonRpcMethod,
          HederaSessionEvent,
        } = await import("@hashgraph/hedera-wallet-connect");

        const networkName = config.network.name;
        const ledgerId =
          networkName === "mainnet" ? LedgerId.MAINNET : LedgerId.TESTNET;
        const chainId =
          networkName === "mainnet"
            ? HederaChainId.Mainnet
            : HederaChainId.Testnet;

        const metadata = {
          name: "Stader HBAR staking",
          description:
            "Liquid staking with Stader. Stake HBAR with Stader to earn rewards.",
          url: window.location.origin,
          icons: ["https://hedera.staderlabs.com/static/stader_logo.svg"],
        };

        const connector = new DAppConnector(
          metadata,
          ledgerId,
          PROJECT_ID,
          Object.values(HederaJsonRpcMethod),
          [HederaSessionEvent.AccountsChanged, HederaSessionEvent.ChainChanged],
          [chainId]
        );

        await connector.init({ logger: "error" });

        const checkConnection = () => {
          if (connector.signers && connector.signers.length > 0) {
            const firstSigner = connector.signers[0];
            const accId = firstSigner.getAccountId()?.toString() || null;

            if (mounted && accId) {
              setAccountId(accId);
              setSigner(firstSigner);
              setStatus("WALLET_CONNECTED");
              setError(null);
            }
          } else if (mounted) {
            setAccountId(null);
            setSigner(null);
            setStatus("WALLET_NOT_CONNECTED");
          }
        };

        checkConnection();

        connectionInterval = setInterval(() => {
          if (mounted) checkConnection();
        }, 1000);

        if (mounted) {
          setDAppConnector(connector);
        }
      } catch (err) {
        console.error("Failed to initialize DAppConnector:", err);
        if (mounted) {
          setError("Failed to initialize wallet connector");
          setStatus("WALLET_NOT_CONNECTED");
        }
      }
    };

    initializeDAppConnector();

    return () => {
      mounted = false;
      if (connectionInterval) {
        clearInterval(connectionInterval);
      }
    };
  }, []);

  const connect = useCallback(async () => {
    if (!dAppConnector) {
      throw new Error(
        "DAppConnector is not initialized. Please refresh the page."
      );
    }

    setIsConnecting(true);
    setError(null);

    try {
      await dAppConnector.openModal();
    } catch (err) {
      console.error("Failed to connect:", err);
      setError("Failed to connect wallet");
    } finally {
      setTimeout(() => setIsConnecting(false), 2000);
    }
  }, [dAppConnector]);

  const signTransaction = useCallback(
    async (transactionString: string): Promise<string | null> => {
      if (!signer || !accountId || !dAppConnector) {
        const errorMsg =
          "Wallet not connected. Please connect your wallet first.";
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      try {
        const { HederaJsonRpcMethod } = await import(
          "@hashgraph/hedera-wallet-connect"
        );

        const network = dAppConnector.ledgerId?.toString() || "testnet";
        const signerAccountId = `hedera:${network}:${accountId}`;

        const result = await signer.request({
          method: HederaJsonRpcMethod.SignTransaction,
          params: {
            signerAccountId: signerAccountId,
            transactionBytes: transactionString,
          },
        });

        return result.signedTransaction || result;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to sign transaction";
        console.error("Transaction signing failed:", errorMsg, err);
        setError(errorMsg);
        throw err;
      }
    },
    [signer, accountId, dAppConnector]
  );

  return {
    connect,
    signTransaction,
    status,
    accountId,
    isConnecting,
    error,
  };
};
