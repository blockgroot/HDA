import { useState, useEffect, useCallback } from "react";
import { config } from "../config/config";
import { Transaction, LedgerId, AccountId } from "@hashgraph/sdk";

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

export const useDAppConnector = (): UseDAppConnectorReturn => {
  const [status, setStatus] = useState<WalletStatus>("INITIALIZING");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dAppConnector, setDAppConnector] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined") return;

    // Suppress WalletConnect deep link errors (harmless - happens when no mobile wallet app is installed)
    const originalError = console.error.bind(console);
    const errorHandler = (message: any, ...args: any[]) => {
      if (
        typeof message === "string" &&
        (message.includes("Failed to launch 'wc:") ||
          message.includes("scheme does not have a registered handler"))
      ) {
        // Suppress this specific error - it's harmless
        return;
      }
      originalError(message, ...args);
    };
    console.error = errorHandler;

    let mounted = true;

    const initializeDAppConnector = async () => {
      try {
        setStatus("INITIALIZING");

        // Dynamically import to avoid SSR issues
        const {
          DAppConnector,
          HederaChainId,
          HederaJsonRpcMethod,
          HederaSessionEvent,
        } = await import("@hashgraph/hedera-wallet-connect");

        const projectId = "f891b15efe53e71351537c2c62cd024d";

        if (!projectId) {
          throw new Error(
            "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Please set it in your environment variables."
          );
        }

        // Get network from config
        const networkName = config.network.name;
        const ledgerId =
          networkName === "mainnet"
            ? LedgerId.MAINNET
            : networkName === "testnet"
            ? LedgerId.TESTNET
            : LedgerId.TESTNET;

        const chainId =
          networkName === "mainnet"
            ? HederaChainId.Mainnet
            : HederaChainId.Testnet;

        const metadata = {
          name: "Stader HBAR staking",
          description:
            "Liquid staking with Stader. Stake HBAR with Stader to earn rewards while keeping full control of your staked tokens.",
          url:
            typeof window !== "undefined"
              ? window.location.origin
              : "https://hedera.staderlabs.com",
          icons: ["https://hedera.staderlabs.com/static/stader_logo.svg"],
        };

        const connector = new DAppConnector(
          metadata,
          ledgerId,
          projectId,
          Object.values(HederaJsonRpcMethod),
          [HederaSessionEvent.AccountsChanged, HederaSessionEvent.ChainChanged],
          [chainId]
        );

        await connector.init({ logger: "error" });

        // Check if already connected
        const checkConnection = () => {
          if (connector.signers && connector.signers.length > 0) {
            const firstSigner = connector.signers[0];
            const accId = firstSigner.getAccountId()?.toString() || null;
            if (mounted) {
              setAccountId(accId);
              setSigner(firstSigner);
              setStatus("WALLET_CONNECTED");
              setError(null);
            }
            return true;
          } else {
            if (mounted) {
              setAccountId(null);
              setSigner(null);
              setStatus("WALLET_NOT_CONNECTED");
            }
            return false;
          }
        };

        // Initial check
        checkConnection();

        // Poll for connection changes (since event API might not be available)
        const connectionInterval = setInterval(() => {
          if (mounted) {
            checkConnection();
          }
        }, 1000);

        // Store interval for cleanup
        (connector as any)._connectionInterval = connectionInterval;

        if (mounted) {
          setDAppConnector(connector);
        }
      } catch (err: any) {
        console.error("Failed to initialize DAppConnector:", err);
        if (mounted) {
          setError(err.message || "Failed to initialize wallet connector");
          setStatus("WALLET_NOT_CONNECTED");
        }
      }
    };

    initializeDAppConnector();

    return () => {
      mounted = false;
      if (dAppConnector && (dAppConnector as any)._connectionInterval) {
        clearInterval((dAppConnector as any)._connectionInterval);
      }
      // Restore original console.error
      console.error = originalError;
    };
  }, []);

  const connect = useCallback(async () => {
    if (!dAppConnector) {
      setError("DAppConnector is not initialized. Please refresh the page.");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      await dAppConnector.openModal();

      // Wait a bit for the connection to establish
      // The polling in useEffect will detect the connection
      setTimeout(() => {
        setIsConnecting(false);
      }, 2000);
    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      setError(err.message || "Failed to connect wallet");
      setIsConnecting(false);
    }
  }, [dAppConnector]);

  const signTransaction = useCallback(
    async (transactionString: string): Promise<string | null> => {
      if (!transactionString || transactionString.trim() === "") {
        throw new Error("Transaction string is empty");
      }

      if (!signer) {
        throw new Error(
          "No wallet connected. Please connect your wallet first."
        );
      }

      if (!dAppConnector) {
        throw new Error("DAppConnector is not initialized.");
      }

      try {
        setError(null);

        // Validate and convert base64 string to transaction bytes
        const trimmedTransaction = transactionString.trim();

        if (!trimmedTransaction) {
          throw new Error("Transaction string is empty");
        }

        // Validate base64 format and get transaction buffer
        let transactionBuffer: Buffer;
        try {
          transactionBuffer = Buffer.from(trimmedTransaction, "base64");

          if (transactionBuffer.length === 0) {
            throw new Error(
              "Invalid transaction: decoded bytes are empty. Please check the base64 format."
            );
          }

          // Log transaction size for debugging
          console.log(`Transaction bytes length: ${transactionBuffer.length}`);
        } catch (base64Error: any) {
          throw new Error(
            `Invalid base64 format: ${base64Error.message}. Please ensure the transaction string is valid base64.`
          );
        }

        const transactionBytes = new Uint8Array(transactionBuffer);

        // Deserialize transaction from bytes
        // This will throw if the bytes are incomplete or corrupted
        let transaction: Transaction;
        try {
          transaction = Transaction.fromBytes(transactionBytes);

          // Validate that transaction was deserialized correctly
          if (!transaction) {
            throw new Error(
              "Failed to deserialize transaction. Please check the transaction format."
            );
          }
        } catch (deserializeError: any) {
          // Handle deserialization errors specifically
          if (
            deserializeError.message?.includes("index out of range") ||
            deserializeError.message?.includes("out of range")
          ) {
            throw new Error(
              `Transaction bytes are incomplete or corrupted. ` +
                `Expected more bytes but only received ${transactionBuffer.length} bytes. ` +
                `Please ensure the full transaction base64 string is provided. ` +
                `The transaction may be truncated or missing data.`
            );
          }
          // Re-throw other deserialization errors
          throw new Error(
            `Failed to deserialize transaction: ${
              deserializeError.message || "Unknown error"
            }`
          );
        }

        // Always try to freeze the transaction with the signer first
        // This ensures the transaction is properly set up with node account IDs and bodyBytes
        // If the transaction is already frozen, this will fail, and we'll handle that case
        try {
          await transaction.freezeWithSigner(signer);
        } catch (freezeError: any) {
          const errorMessage = freezeError.message || "";

          // If the transaction is already frozen/immutable, that's okay - proceed to signing
          if (
            errorMessage.includes("immutable") ||
            errorMessage.includes("frozen") ||
            errorMessage.includes("already")
          ) {
            // Transaction is already frozen - we can't freeze it again, but we can try to sign it
            console.warn(
              "Transaction is already frozen. Proceeding to sign without re-freezing."
            );

            // Verify transaction has bodyBytes before attempting to sign
            const hasBodyBytes = (transaction as any).bodyBytes !== undefined;
            if (!hasBodyBytes) {
              throw new Error(
                "Transaction is frozen but does not have bodyBytes. " +
                  "The transaction may have been frozen incorrectly or is in an invalid state. " +
                  "Please ensure the transaction was properly created and frozen with the correct signer."
              );
            }
            // Transaction is frozen and has bodyBytes - proceed to signing
          } else {
            // Some other error occurred during freezing - re-throw it
            throw new Error(
              `Failed to freeze transaction with signer: ${errorMessage}`
            );
          }
        }

        // Verify transaction has bodyBytes before signing
        if (!(transaction as any).bodyBytes) {
          throw new Error(
            "Transaction does not have bodyBytes. It must be frozen before signing."
          );
        }

        // Sign the transaction (does NOT execute)
        // This will open the wallet modal for user to approve/reject
        // The signer's signTransaction method requires the transaction to have bodyBytes
        const signedTransaction = await signer.signTransaction(transaction);

        // Convert signed transaction to bytes and return as base64 string
        const signedTransactionBytes = signedTransaction.toBytes();
        return Buffer.from(signedTransactionBytes).toString("base64");
      } catch (err: any) {
        console.error("Error signing transaction:", err);

        // Provide more specific error messages for common issues
        let errorMessage =
          err.message || "Failed to sign transaction. Please try again.";

        if (
          err.message?.includes("index out of range") ||
          err.message?.includes("out of range")
        ) {
          errorMessage =
            `Transaction bytes are incomplete or corrupted. ` +
            `The transaction base64 string appears to be truncated or missing data. ` +
            `Please ensure you provide the complete transaction string.`;
        }

        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [signer, dAppConnector]
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
