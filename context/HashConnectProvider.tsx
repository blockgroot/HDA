import {
  AccountBalance,
  AccountBalanceQuery,
  AccountId,
  Client,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Timestamp,
  Transaction,
  TransactionId,
  TransactionReceipt,
} from "@hashgraph/sdk";
import { WalletStatus } from "@molecules/WalletSelector/WalletSelector";
import { BladeService } from "@services/blade.service";
import { HashConnectService } from "@services/hash-connect.service";
import { StorageService } from "@services/storage.service";
import axios from "axios";
import { config } from "config/config";
import { tvlUpdateInterval } from "constants/constants";
import { HashConnectTypes, MessageTypes } from "hashconnect";
import React, { useEffect, useRef, useState } from "react";

//Type declarations
export interface SaveData {
  topic: string;
  pairingString: string;
  privateKey: string;
  pairedWalletData: HashConnectTypes.WalletMetadata | null;
  pairedAccounts: string[];
  network?: string;
  id?: string;
  accountIds?: string[];
  walletExtensionType: WalletExtensionType;
}

type Networks = "testnet" | "mainnet" | "previewnet";
type WalletExtensionType = "hashpack" | "blade" | "";
export type TransactionType = "stake" | "unstake";
export type WithdrawStatus = "NONE" | "IN_PROGRESS" | "SUCCESS" | "FAILED";

declare var chrome: any;
let bladeConnect: any;

interface PropsType {
  children: React.ReactNode;
  hashConnect: HashConnectService;
  network: Networks;
  metadata?: HashConnectTypes.AppMetadata;
  debug?: boolean;
}

export interface buildTransactionParams {
  (
    contractId: string,
    functionName: string,
    parameters: ContractFunctionParameters,
    amount: number,
    accountId: string
  ): void;
}

export interface HashConnectProviderAPI {
  connect: (type: ConnectType) => void;
  disconnect: () => void;
  accountBalance: AccountBalance | null;
  selectedAccount: string;
  walletData: SaveData;
  network: Networks;
  metadata?: HashConnectTypes.AppMetadata;
  installedExtensions: HashConnectTypes.WalletMetadata | null;
  isBladeExtensionInstalled: boolean;
  isExtensionInstalled: boolean;
  withdrawStatus: WithdrawStatus;
  transactionType: TransactionType;
  setWithdrawStatus: (status: WithdrawStatus) => void;
  status: string;
  stake: (amount: number) => void;
  unstake: (amount: number, exchangeRate: number) => void;
  withdraw: (index: number) => void;
  transactionStatus: string;
  setTransActionStatus: (status: string) => void;
  signTransaction: (transaction: string) => Promise<string | null>;
  tvl: number;
}

export enum ConnectType {
  CHROME_EXTENSION,
  BLADE_WALLET,
  INSTALL_EXTENSION,
}

const INITIAL_SAVE_DATA: SaveData = {
  topic: "",
  pairingString: "",
  privateKey: "",
  pairedAccounts: [],
  pairedWalletData: null,
  walletExtensionType: "",
};

// export declare enum WalletStatus {
//   INITIALIZING = "INITIALIZING",
//   WALLET_NOT_CONNECTED = "WALLET_NOT_CONNECTED",
//   WALLET_CONNECTED = "WALLET_CONNECTED",
// }

const bladeService = new BladeService();

let APP_CONFIG: HashConnectTypes.AppMetadata = {
  name: "Stader HBAR staking",
  description:
    "Liquid staking with Stader. Stake HBAR with Stader to earn rewards while keeping full control of your staked tokens. Start earning rewards in just a few clicks",
  icon: "https://hedera.staderlabs.com/static/stader_logo.svg",
};

export const HashConnectAPIContext =
  React.createContext<HashConnectProviderAPI>({
    connect: (type: ConnectType) => null,
    disconnect: () => null,
    accountBalance: null,
    selectedAccount: "",
    isBladeExtensionInstalled: false,
    isExtensionInstalled: false,
    walletData: INITIAL_SAVE_DATA,
    network: config.network.name as Networks,
    installedExtensions: null,
    transactionType: "stake",
    withdrawStatus: "NONE",
    status: "INITIALIZING",
    setWithdrawStatus: () => {},
    stake: () => null,
    unstake: () => null,
    withdraw: () => null,
    transactionStatus: "",
    setTransActionStatus: () => null,
    signTransaction: (transaction) => Promise.resolve(null),
    tvl: 0,
  });

interface signedTransactionParams {
  userId: string;
  signature: string;
}

// //fetch this from config/move to config
// export const tokenId = "0.0.30873456";
// export const contractId = "0.0.30873462";

// - Token ID: 0.0.33981601
// - Staking contract ID: 0.0.33981604
// - Rewards contract ID: 0.0.33981605

// export const tokenId = "0.0.33986222";
// export const contractId = "0.0.33986225";
let tvlInterval: any;

export default function HashConnectProvider({
  children,
  hashConnect,
  metadata: metadata,
  network: network,
  debug,
}: PropsType) {
  debug = true;
  //Saving Wallet Details in state
  const [saveData, _setSaveData] = useState<SaveData>(INITIAL_SAVE_DATA);
  const [installedExtensions, setInstalledExtensions] =
    useState<HashConnectTypes.WalletMetadata | null>(null);
  const [isExtensionInstalled, setExtensionInstalled] =
    useState<boolean>(false);
  const [accountBalance, setAccountBalance] = useState<AccountBalance | null>(
    null
  );
  const [tvl, setTvl] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [transactionType, setTransactionType] =
    useState<TransactionType>("stake");
  const [status, _setStatus] = useState<string>(WalletStatus.INITIALIZING);
  const [transactionStatus, setTransActionStatus] = useState<string>("");
  const [withdrawStatus, setWithdrawStatus] = useState<WithdrawStatus>("NONE");
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [connectedAccountType, setConnectedAccountType] =
    useState<WalletExtensionType>("");

  const [isBladeExtensionInstalled, setBladeExtensionInstalled] =
    useState<boolean>(Boolean(bladeConnect));

  const statusRef = useRef(status);

  const setStatus = (status: string) => {
    statusRef.current = status;
    _setStatus(status);
  };

  const saveDataRef = useRef(saveData);

  const setSaveData = (saveData: SaveData) => {
    saveDataRef.current = saveData;
    _setSaveData(saveData);
  };

  //? Initialize the package in mount
  const initializeHashConnect = async () => {
    const saveData = INITIAL_SAVE_DATA;
    const localData = StorageService.loadLocalData();
    await bladeService.checkExtensionInstalled();
    setBladeExtensionInstalled(bladeService.isExtensionInstalled);
    bladeService.setSigner();
    // console.log("localData", localData);
    try {
      if (!localData) {
        if (debug) console.log("===Local data not found.=====");

        //first init and store the private for later
        let initData = await hashConnect.initialize(
          metadata ?? APP_CONFIG,
          network,
          debug
        );
        saveData.privateKey = initData.privateKey;

        saveData.topic = initData.topic;
        // console.log({ state });
        //generate a pairing string, which you can display and generate a QR code from
        saveData.pairingString = initData.pairingString;
      } else {
        // if (debug) console.log("====Local data found====", localData);
        //use loaded data for initialization + connection
        if (localData.walletExtensionType == "hashpack") {
          // Ensure HashConnect is initialized with private key BEFORE connecting
          // This is critical for encryption to work properly
          if (localData?.privateKey) {
            try {
              await hashConnect.init(
                metadata ?? APP_CONFIG,
                localData.privateKey
              );
              if (debug) {
                console.log(
                  "HashConnect initialized with private key for reconnection"
                );
              }
            } catch (initError: any) {
              // If init fails, log but continue - it might already be initialized
              if (debug) {
                console.warn(
                  "HashConnect init during reconnect:",
                  initError?.message
                );
              }
            }
          }

          setInstalledExtensions(localData?.pairedWalletData);
          setExtensionInstalled(true);
          const state = await hashConnect.connect(
            localData?.topic,
            localData?.pairedWalletData ?? metadata
          );
          // Re-detect local wallets when reconnecting (important for production)
          hashConnect.listeners.findLocalWallets();
        } else {
          await bladeService.loadWallet();
        }
      }
    } catch (error) {
      setNetworkError(true);
      console.log("error found", error);
    } finally {
      if (localData) {
        setSaveData({ ...saveData, ...localData });
        setConnectedAccountType(localData.walletExtensionType);
        localData.accountIds && setSelectedAccount(localData.accountIds[0]);
        localData.accountIds && (await getAccounts(localData.accountIds[0]));
      } else {
        setSaveData({ ...saveData, ...saveData });
        // await getAccounts(saveData.accountIds[0]);
      }
      // await getAccounts(saveData.accountIds[0]);
      // console.log(saveData);
      if (debug) console.log("====Wallet details updated to state====");
    }
    return localData;
  };

  const saveDataInLocalStorage = async (
    data: MessageTypes.ApprovePairing,
    extensionType?: WalletExtensionType
  ) => {
    if (debug)
      console.info("===============Saving to localstorage::=============");
    const { metadata, ...restData } = data;
    const walletType = extensionType || connectedAccountType || "hashpack";
    const saveObj: SaveData = {
      ...saveData,
      pairedWalletData: metadata,
      pairedAccounts: restData.accountIds,
      walletExtensionType: walletType,
      ...restData,
    };
    // console.log(saveObj, "saveObj");
    // await setSaveData((prevSaveData) => {
    //   prevSaveData.pairedWalletData = metadata;
    //   console.log("restData", { ...prevSaveData, ...restData });
    //   return { ...prevSaveData, ...restData };
    // });
    // console.log("saveData", saveData);
    setSaveData(saveObj);
    // Ensure connectedAccountType is set
    if (walletType) {
      setConnectedAccountType(walletType);
    }
    // setAccountId(restData.accountIds[0]);
    StorageService.saveData(saveObj);
    if (
      saveObj !== undefined &&
      saveObj.accountIds &&
      saveObj.accountIds[0] !== undefined
    ) {
      setSelectedAccount(saveObj.accountIds[0]);
      // Pass the wallet type explicitly to avoid stale closure issues
      await getAccounts(saveObj.accountIds[0]!, walletType);
    }
  };

  const additionalAccountResponseEventHandler = (
    data: MessageTypes.AdditionalAccountResponse
  ) => {
    if (debug) console.debug("additionalAccountResponseEvent", data);
    // Do a thing
  };

  const foundExtensionEventHandler = (
    data: HashConnectTypes.WalletMetadata
  ) => {
    if (debug) console.debug("====foundExtensionEvent====", data);
    // Do a thing
    console.log("foundExtensionEventHandler", data);
    // Use statusRef.current to get the current status value (avoids stale closure)
    if (statusRef.current === WalletStatus.INITIALIZING) {
      setStatus(WalletStatus.WALLET_NOT_CONNECTED);
      setInstalledExtensions(data as HashConnectTypes.WalletMetadata);
    }
  };

  const pairingEventHandler = (data: MessageTypes.ApprovePairing) => {
    if (debug) console.log("===Wallet connected=====", data);
    // Save Data to localStorage

    saveDataInLocalStorage(data, "hashpack");
  };

  const transactionHandler = (data: MessageTypes.Transaction) => {
    // console.log("received data", data);
  };

  // useEffect(() => {
  //   const listener = (event: MessageEvent) => {
  //     if (event.data.type === "hashconnect-query-extension-response") {
  //       setExtensionInstalled(true);
  //     }
  //   };
  //   window.addEventListener("message", listener);
  //   window.postMessage({ type: "hashconnect-query-extension" }, "*");
  //   setTimeout(() => {
  //     window.removeEventListener("message", listener);
  //     if (!isExtensionInstalled) {
  //       setStatus(WalletStatus.WALLET_NOT_CONNECTED);
  //     }
  //   }, 5000);
  //   return () => {
  //     window.removeEventListener("message", listener);
  //   };
  // });

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined") return;

    //Intialize the setup

    // Use .on() instead of .once() so the handler can fire multiple times
    // This is critical for production where extensions might not be detected immediately
    hashConnect.listeners.foundExtensionEvent.on(foundExtensionEventHandler);
    hashConnect.listeners.pairingEvent.on(pairingEventHandler);
    hashConnect.listeners.transactionEvent.on(transactionHandler);

    hashConnect.listeners.transactionResolver = () => {};
    //

    getTvl();
    tvlInterval = setInterval(async () => {
      await getTvl();
    }, tvlUpdateInterval);
    initializeHashConnect().then((localData) => {
      if (StorageService.loadLocalData()) return;
      setTimeout(() => {
        if (!installedExtensions || !bladeService.isExtensionInstalled) {
          setStatus(WalletStatus.WALLET_NOT_CONNECTED);
        }
      }, 5000);
    });

    // Attach event handlers

    return () => {
      // Detach existing handlers

      clearInterval(tvlInterval);
      hashConnect.listeners.foundExtensionEvent.off(foundExtensionEventHandler);
      hashConnect.listeners.pairingEvent.off(pairingEventHandler);
      hashConnect.listeners.transactionEvent.off(transactionHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedAccountType]);

  // useEffect(() => {
  //   console.log("status", status);
  // }, [status]);

  const connect = async (type: ConnectType) => {
    // console.log({ type, installedExtensions });
    // switch (type) {
    //   case ConnectType.CHROME_EXTENSION:
    //     await hashConnect.connectToLocalWallet(saveData?.pairingString);
    //     break;
    //   case ConnectType.INSTALL_EXTENSION:
    //     window.open(config.extension_url, "_blank");
    //     break;
    // }
    if (type === ConnectType.BLADE_WALLET && !isBladeExtensionInstalled) {
      window.open(config.blade_extension_url, "_blank");
    } else if (type === ConnectType.BLADE_WALLET) {
      const account = await bladeService.loadWallet();
      setStatus(WalletStatus.WALLET_CONNECTED);
      setConnectedAccountType("blade");
      setSelectedAccount(account.toString());
      const balance = await bladeService.getBalance();
      setAccountBalance(balance);
      const walletData = bladeService.getWalletData();
      saveDataInLocalStorage(walletData, "blade");
    } else if (installedExtensions) {
      if (debug) console.log("Pairing String::", saveData.pairingString);
      setConnectedAccountType("hashpack");
      hashConnect.connectToLocalWallet(saveData?.pairingString);
    } else {
      if (debug) console.log("====No Extension is not in browser====");
      window.open(config.extension_url, "_blank");
    }
  };

  const disconnect = () => {
    console.log("disconnected");
    // setSaveData(INITIAL_SAVE_DATA);
    setStatus(WalletStatus.WALLET_NOT_CONNECTED);
    // setInstalledExtensions(null);

    StorageService.remove();
    initializeHashConnect();
  };

  const getTvl = async () => {
    try {
      //Create the query
      const query = new AccountBalanceQuery().setContractId(
        config.ids.stakingContractId
      );

      const client = Client.forName(config.network.name);

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("TVL query timeout")), 10000); // 10 second timeout
      });

      //Sign the query with the client operator private key and submit to a Hedera network
      const balance = (await Promise.race([
        query.execute(client),
        timeoutPromise,
      ])) as AccountBalance;

      setTvl(balance.hbars.toTinybars().toNumber());
      setNetworkError(false); // Clear network error on success
    } catch (error: any) {
      // Check if error is a network/503 error
      const isNetworkError =
        error.message?.includes("503") ||
        error.message?.includes("Service Unavailable") ||
        error.message?.includes("unexpected frame length") ||
        error.message?.includes("timeout");

      // Only log non-network errors or if debug is enabled
      if (debug || !isNetworkError) {
        console.warn("Error fetching TVL:", error.message || error);
      }

      setNetworkError(true);
      // Keep previous TVL value - don't reset it on error
    }
  };

  const getAccounts = async (
    accountId: string,
    accountType?: WalletExtensionType,
    retryCount: number = 0
  ): Promise<void> => {
    //Create the account info query
    const accountTypeToUse = accountType || connectedAccountType;

    // Set status to connected first, even if balance query fails
    // The wallet is connected if we have an account ID and account type
    if (accountId && accountTypeToUse) {
      setStatus(WalletStatus.WALLET_CONNECTED);
    }

    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000; // 1 second

    try {
      if (accountTypeToUse === "hashpack") {
        const query = new AccountBalanceQuery().setAccountId(accountId);
        const client = Client.forName(config.network.name);

        // Add timeout to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Balance query timeout")), 10000); // 10 second timeout
        });

        // Sign with client operator private key and submit the query to a Hedera network
        const balance = (await Promise.race([
          query.execute(client),
          timeoutPromise,
        ])) as AccountBalance;

        setAccountBalance(balance);
        setNetworkError(false); // Clear network error on success
      } else if (accountTypeToUse === "blade") {
        const balance = await bladeService.getBalance();
        setAccountBalance(balance);
        setNetworkError(false); // Clear network error on success
      }
    } catch (error: any) {
      // Check if error is a network/503 error that we should retry
      const isRetryableError =
        error.message?.includes("503") ||
        error.message?.includes("Service Unavailable") ||
        error.message?.includes("unexpected frame length") ||
        error.message?.includes("timeout") ||
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT";

      if (isRetryableError && retryCount < MAX_RETRIES) {
        // Retry with exponential backoff
        if (debug) {
          console.log(
            `Balance query failed, retrying... (${
              retryCount + 1
            }/${MAX_RETRIES})`
          );
        }
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * (retryCount + 1))
        );
        return getAccounts(accountId, accountType, retryCount + 1);
      }

      // Log error only if it's not a common network issue or if debug is enabled
      if (debug || !isRetryableError) {
        console.warn("Error fetching account balance:", error.message || error);
      }

      // Set network error flag but don't break the app
      setNetworkError(true);

      // Keep balance as null/previous value - don't clear it on error
      // Status is already set to WALLET_CONNECTED above, so wallet connection is still recognized
      // even if balance query fails
    }
  };

  const getTimeStamp = async () => {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    try {
      const response: any = await axios.get(`/api/timestamp`);
      if (response?.data) {
        return response.data.timestamp;
      }
    } catch (err) {
      // Handle Error Here
      console.error("error", err);
      return timestamp;
    }
  };

  const signTransaction = async (transactionString: string) => {
    if (!transactionString || transactionString.trim() === "") {
      throw new Error("Transaction string is empty");
    }

    if (!selectedAccount) {
      throw new Error("No account selected. Please connect your wallet.");
    }

    try {
      // Decode base64 string to Uint8Array
      // Remove any whitespace from the input
      const cleanTransactionString = transactionString
        .trim()
        .replace(/\s/g, "");
      const transactionBuffer = Buffer.from(cleanTransactionString, "base64");
      const transactionBytes = new Uint8Array(transactionBuffer);

      if (transactionBytes.length === 0) {
        throw new Error("Invalid transaction: decoded bytes are empty");
      }

      // Try to deserialize the transaction to verify it's valid
      // This helps ensure the transaction is in the correct format
      let transactionValid = false;
      let payerAccount: string | null = null;
      let deserializedTx: Transaction | null = null;
      let parseError: any = null;

      try {
        // Validate transaction length before attempting to parse
        if (transactionBytes.length < 10) {
          throw new Error(
            `Transaction too short: ${transactionBytes.length} bytes. ` +
              `A valid Hedera transaction should be at least 50 bytes. ` +
              `The transaction string may be incomplete or corrupted.`
          );
        }

        if (debug) {
          console.log("Transaction bytes info:", {
            length: transactionBytes.length,
            firstBytes: Array.from(transactionBytes.slice(0, 20)),
            hexPreview: Buffer.from(transactionBytes.slice(0, 30)).toString(
              "hex"
            ),
          });
        }

        deserializedTx = Transaction.fromBytes(transactionBytes);
        // Verify the transaction is frozen (has transaction ID)
        if (deserializedTx.transactionId) {
          transactionValid = true;
          // Get the payer account from the transaction ID for logging
          payerAccount =
            deserializedTx.transactionId.accountId?.toString() || null;

          // Check if transaction is frozen (required for signing)
          if (!deserializedTx.isFrozen()) {
            console.warn(
              "Transaction is not frozen. The wallet may not be able to sign it."
            );
          }

          if (payerAccount && payerAccount !== selectedAccount) {
            console.warn(
              `Transaction payer (${payerAccount}) differs from connected account (${selectedAccount}). Will attempt to sign with connected account.`
            );
          }

          if (debug) {
            console.log("Transaction validated:", {
              transactionId: deserializedTx.transactionId.toString(),
              payerAccount: payerAccount,
              selectedAccount: selectedAccount,
              accountToSign: selectedAccount,
              isFrozen: deserializedTx.isFrozen(),
              nodeAccountIds: deserializedTx.nodeAccountIds?.map((id) =>
                id.toString()
              ),
            });
          }
        } else {
          throw new Error(
            "Transaction does not have a transaction ID. It may not be properly formatted."
          );
        }
      } catch (error: any) {
        parseError = error;
        const errorMsg = error.message || String(error);
        console.warn("Failed to parse transaction:", errorMsg);

        // Provide more specific error messages
        if (errorMsg.includes("index out of range")) {
          console.warn(
            `⚠️ Transaction bytes appear incomplete or may be in a different format. ` +
              `Length: ${transactionBytes.length} bytes. ` +
              `Attempting to send anyway - the wallet may be able to parse it.`
          );
          if (debug) {
            console.warn("Transaction bytes analysis:", {
              totalBytes: transactionBytes.length,
              first20Bytes: Array.from(transactionBytes.slice(0, 20)),
              last10Bytes: Array.from(transactionBytes.slice(-10)),
              hexPreview: Buffer.from(transactionBytes.slice(0, 30)).toString(
                "hex"
              ),
            });
          }
          // Don't throw - allow sending even if we can't parse it
          // The wallet might be able to handle it
          transactionValid = true; // Allow proceeding
        } else {
          console.warn(
            "⚠️ Could not parse transaction, but will attempt to send it anyway. The wallet may be able to handle it."
          );
          // Allow proceeding - some transaction formats might not parse easily
          transactionValid = true;
        }
      }

      // Note: We allow proceeding even if parsing failed
      // The wallet might be able to parse transactions we can't

      // Always use the connected account for signing
      const accountToSign = selectedAccount;

      if (debug) {
        console.log("Signing transaction:", {
          accountId: selectedAccount,
          accountToSign: accountToSign,
          transactionLength: transactionBytes.length,
          transactionValid: transactionValid,
          returnTransaction: true,
        });
      }

      const response: MessageTypes.TransactionResponse = await sendTransaction(
        transactionBytes,
        accountToSign,
        true
      );

      if (debug) {
        console.log("Transaction response:", {
          success: response.success,
          hasSignedTransaction: !!response.signedTransaction,
          hasReceipt: !!response.receipt,
          error: response.error,
          response: response,
        });
      }

      // Check if wallet received but didn't respond (wallet opened but showed nothing)
      if (
        !response.success &&
        !response.error &&
        !response.signedTransaction &&
        !response.receipt
      ) {
        console.warn(
          "⚠️ Wallet opened but no response received. This usually means:"
        );
        console.warn(
          "   1. The transaction format is not recognized by the wallet"
        );
        console.warn("   2. The transaction bytes are incomplete or corrupted");
        console.warn("   3. The wallet cannot parse this transaction type");
        console.warn(
          "   Transaction length:",
          transactionBytes.length,
          "bytes"
        );
        throw new Error(
          "Wallet opened but could not display the transaction. " +
            "The transaction format may not be recognized. " +
            "Please ensure you're using a complete, frozen Hedera transaction in base64 format. " +
            "Check the browser console for more details."
        );
      }

      if (response.success && response.signedTransaction) {
        const signedTransaction = Buffer.from(
          response.signedTransaction
        ).toString("base64");
        return signedTransaction;
      } else if (response.error) {
        throw new Error(`Transaction signing failed: ${response.error}`);
      } else if (!response.success) {
        // If response is not successful but no error, the user might have rejected it
        throw new Error(
          "Transaction signing was cancelled or rejected. Please check your wallet."
        );
      }

      return null;
    } catch (error: any) {
      console.error("Error in signTransaction:", error);
      throw error;
    }
  };

  const stakeHashpack = async (
    accountId: AccountId,
    transaction: ContractExecuteTransaction,
    isWithDrawn: boolean = false
  ) => {
    const transactionBytes = transaction.toBytes();

    const response: MessageTypes.TransactionResponse = await sendTransaction(
      transactionBytes,
      accountId.toString(),
      false
    );

    if (response.success) {
      if (!isWithDrawn) {
        setTransActionStatus("SUCCESS");
      } else {
        setWithdrawStatus("SUCCESS");
      }
    }

    if (response.success && !response.signedTransaction)
      console.log(TransactionReceipt.fromBytes(response.receipt as Uint8Array));
    else if (response.success && response.signedTransaction)
      console.log(
        Transaction.fromBytes(response.signedTransaction as Uint8Array)
      );
    else {
      if (!isWithDrawn) {
        setTransActionStatus("FAILED");
      } else {
        setWithdrawStatus("FAILED");
      }
    }

    getAccounts(accountId.toString());
    getTvl();
  };

  const stakeBlade = async (
    accountId: AccountId,
    transaction: ContractExecuteTransaction,
    isWithDrawn: boolean = false
  ) => {
    try {
      const response = await bladeService.sendTransaction(transaction);
      const client = Client.forName(config.network.name);
      const receipt: TransactionReceipt = await response.getReceipt(client);

      if (receipt.status.toString() === "SUCCESS") {
        if (!isWithDrawn) {
          setTransActionStatus("SUCCESS");
        } else {
          setWithdrawStatus("SUCCESS");
        }
      } else {
        if (!isWithDrawn) {
          setTransActionStatus("FAILED");
        } else {
          setWithdrawStatus("FAILED");
        }
      }
    } catch (error) {
      console.log(error);
      if (!isWithDrawn) {
        setTransActionStatus("FAILED");
      } else {
        setWithdrawStatus("FAILED");
      }
    }

    getAccounts(accountId.toString());
    getTvl();
  };

  const stake = async (amount: number) => {
    setTransActionStatus("START");
    setTransactionType("stake");
    // const timestamp = Math. floor(new Date().getTime() / 1000);
    const timestamp = await getTimeStamp();
    const validStart = new Timestamp(timestamp, 0);

    const accountId: AccountId = AccountId.fromString(
      selectedAccount as string
    );

    let transId = TransactionId.withValidStart(accountId, validStart);

    const transaction = new ContractExecuteTransaction()
      .setContractId(config.ids.stakingContractId)
      .setGas(2_000_000)
      .setPayableAmount(amount)
      .setFunction("stake")
      .setNodeAccountIds([new AccountId(3)])
      .setTransactionId(transId)
      .freeze();

    if (connectedAccountType === "hashpack") {
      stakeHashpack(accountId, transaction);
    } else if (connectedAccountType === "blade") {
      stakeBlade(accountId, transaction);
    }
  };

  const unstake = async (amount: number, exchangeRate: number) => {
    setTransActionStatus("START");
    setTransactionType("unstake");
    const accountId: AccountId = AccountId.fromString(
      selectedAccount as string
    );

    let transId = TransactionId.generate(accountId);
    // const unstakeAmount = new Hbar(amount);
    const transaction = new ContractExecuteTransaction()
      .setContractId(config.ids.stakingContractId)
      .setGas(2_000_000)
      .setTransactionMemo(exchangeRate.toString())
      .setFunction(
        "unStake",
        new ContractFunctionParameters().addUint256(amount)
      )
      .setNodeAccountIds([new AccountId(3)])
      .setTransactionId(transId)
      .freeze();

    if (connectedAccountType === "hashpack") {
      stakeHashpack(accountId, transaction);
    } else if (connectedAccountType === "blade") {
      stakeBlade(accountId, transaction);
    }
  };

  const withdraw = async (index: number) => {
    setWithdrawStatus("IN_PROGRESS");

    const accountId: AccountId = AccountId.fromString(
      selectedAccount as string
    );

    let transId = TransactionId.generate(accountId);
    const transaction = new ContractExecuteTransaction()
      .setContractId(config.ids.undelegationContractId)
      .setGas(2_000_000)
      .setFunction(
        "withdraw",
        new ContractFunctionParameters().addUint256(index)
      )
      .setNodeAccountIds([new AccountId(3)])
      .setTransactionId(transId)
      .freeze();

    if (connectedAccountType === "hashpack") {
      stakeHashpack(accountId, transaction, true);
    } else if (connectedAccountType === "blade") {
      stakeBlade(accountId, transaction, true);
    }
  };

  const sendTransaction = async (
    trans: Uint8Array,
    acctToSign: string,
    return_trans: boolean = false
  ) => {
    // Use ref to get the latest saveData to avoid stale closure issues
    const currentSaveData = saveDataRef.current;
    const topic = currentSaveData.topic;

    if (!topic) {
      throw new Error(
        "HashConnect is not properly initialized. Topic is missing. Please reconnect your wallet."
      );
    }

    if (!currentSaveData.privateKey) {
      throw new Error(
        "HashConnect is not properly initialized. Private key is missing. Please reconnect your wallet."
      );
    }

    // HashConnect should already be initialized when the wallet connects
    // But we need to ensure it's initialized with the private key for encryption
    // Try to ensure initialization without throwing if it's already done
    try {
      // Check if we need to initialize by attempting init
      // If it's already initialized, this should not throw an error in newer versions
      // But if it does throw, we'll catch it and proceed anyway
      await hashConnect.init(
        metadata ?? APP_CONFIG,
        currentSaveData.privateKey
      );
      if (debug) {
        console.log("HashConnect initialized/verified for transaction");
      }
    } catch (error: any) {
      // HashConnect might already be initialized - that's fine
      // The important thing is that we have the private key stored
      // and HashConnect should maintain its encryption state
      const errorMessage = error?.message || String(error);
      if (debug) {
        console.log(
          "HashConnect init check (may already be initialized):",
          errorMessage
        );
      }
      // Don't throw - proceed with transaction as HashConnect might still work
    }

    // Validate transaction bytes before sending
    if (!trans || trans.length === 0) {
      throw new Error("Transaction bytes are empty or invalid");
    }

    if (debug) {
      console.log("Sending transaction to HashConnect:", {
        topic: topic,
        accountToSign: acctToSign,
        transactionLength: trans.length,
        returnTransaction: return_trans,
        firstBytes: Array.from(trans.slice(0, 10)), // First 10 bytes for debugging
      });
    }

    const transaction: MessageTypes.Transaction = {
      topic: topic,
      byteArray: trans,
      metadata: {
        accountToSign: acctToSign,
        returnTransaction: return_trans,
      },
    };

    try {
      if (debug) {
        console.log("Calling hashConnect.sendTransaction with:", {
          topic: transaction.topic,
          byteArrayLength: transaction.byteArray.length,
          metadata: transaction.metadata,
          transactionHex: Buffer.from(trans.slice(0, 50)).toString("hex"),
        });
      }

      const response = await hashConnect.sendTransaction(topic, transaction);

      if (debug) {
        console.log("HashConnect sendTransaction response:", {
          success: response.success,
          hasSignedTransaction: !!response.signedTransaction,
          hasReceipt: !!response.receipt,
          error: response.error,
          fullResponse: response,
        });

        // Log if wallet received the transaction
        if (response.success === false && !response.error) {
          console.warn(
            "⚠️ Transaction sent but wallet may not be displaying it. This could mean:"
          );
          console.warn(
            "   1. The transaction format is not recognized by the wallet"
          );
          console.warn("   2. The wallet needs additional metadata");
          console.warn(
            "   3. The transaction type is not supported for display"
          );
        }
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.message || String(error);

      // If we get the SimpleCrypto error, HashConnect encryption is not set up
      // This means the init didn't work or HashConnect lost its encryption state
      if (
        errorMessage.includes("SimpleCrypto") ||
        errorMessage.includes("SECRET KEY")
      ) {
        if (debug) {
          console.log(
            "SimpleCrypto error - HashConnect encryption not initialized. Attempting fix..."
          );
        }

        // The issue is that HashConnect needs to be initialized with the private key
        // But calling init again might not work if it's already initialized
        // We need to ensure the HashConnect instance has the encryption key

        // Try to disconnect and reconnect to force re-initialization
        try {
          // First, try to ensure we're connected with the topic
          if (currentSaveData.pairedWalletData) {
            await hashConnect.connect(
              currentSaveData.topic,
              currentSaveData.pairedWalletData
            );
          }

          // Wait a moment for connection to establish
          await new Promise((resolve) => setTimeout(resolve, 200));

          // Retry the transaction
          const response = await hashConnect.sendTransaction(
            topic,
            transaction
          );
          return response;
        } catch (retryError: any) {
          // If that doesn't work, the user needs to reconnect
          throw new Error(
            `HashConnect encryption is not initialized. ` +
              `This usually happens when the wallet connection is lost. ` +
              `Please disconnect and reconnect your wallet, then try again.`
          );
        }
      }

      // For other errors, throw them as-is
      throw error;
    }
  };

  return (
    <HashConnectAPIContext.Provider
      value={{
        connect,
        disconnect,
        accountBalance,
        selectedAccount,
        walletData: saveData,
        network: network,
        installedExtensions,
        isBladeExtensionInstalled,
        isExtensionInstalled,
        transactionType,
        status,
        stake,
        unstake,
        withdraw,
        setWithdrawStatus,
        withdrawStatus,
        transactionStatus,
        setTransActionStatus: async (newStatus) => {
          setTransActionStatus(newStatus);
          if (
            isBladeExtensionInstalled &&
            connectedAccountType === "blade" &&
            newStatus == ""
          ) {
            const balance = await bladeService.getBalance();
            setAccountBalance(balance);
          }
        },
        signTransaction,
        tvl,
      }}
    >
      {children}
    </HashConnectAPIContext.Provider>
  );
}

const defaultProps: Partial<PropsType> = {
  metadata: {
    name: "Stader HBAR staking",
    description:
      "Liquid staking with Stader. Stake HBAR with Stader to earn rewards while keeping full control of your staked tokens. Start earning rewards in just a few clicks",
    icon: "https://hedera.staderlabs.com/static/stader_logo.svg",
  },
  network: config.network.name as Networks,
  debug: false,
};

HashConnectProvider.defaultProps = defaultProps;
