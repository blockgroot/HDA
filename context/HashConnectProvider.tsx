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
          await hashConnect.init(metadata ?? APP_CONFIG, localData?.privateKey);
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
    setSaveData(saveObj);
    setConnectedAccountType(walletType);
    StorageService.saveData(saveObj);
    if (
      saveObj !== undefined &&
      saveObj.accountIds &&
      saveObj.accountIds[0] !== undefined
    ) {
      setSelectedAccount(saveObj.accountIds[0]);
      await getAccounts(saveObj.accountIds[0]!);
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

      //Sign the query with the client operator private key and submit to a Hedera network
      const balance = await query.execute(client);
      // console.log(balance);

      setTvl(balance.hbars.toTinybars().toNumber());
    } catch (error: any) {
      setNetworkError(true);
      console.log(error.message);
    }
  };

  const getAccounts = async (accountId: string) => {
    // Set status to connected first, even if balance query fails
    if (accountId && connectedAccountType) {
      setStatus(WalletStatus.WALLET_CONNECTED);
    }

    //Create the account info query
    try {
      if (connectedAccountType === "hashpack") {
        const query = new AccountBalanceQuery().setAccountId(accountId);
        const client = Client.forName(config.network.name);
        // Sign with client operator private key and submit the query to a Hedera network
        const balance = await query.execute(client);
        setAccountBalance(balance);
      } else if (connectedAccountType === "blade") {
        const balance = await bladeService.getBalance();
        setAccountBalance(balance);
      }
    } catch (error: any) {
      setNetworkError(true);
      console.log(error.message);
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

    // Convert base64 string to Uint8Array
    const transactionBuffer = Buffer.from(transactionString.trim(), "base64");
    const transaction = new Uint8Array(transactionBuffer);

    const response: MessageTypes.TransactionResponse = await sendTransaction(
      transaction,
      selectedAccount,
      true
    );

    if (response.success && response.signedTransaction) {
      const signedTransaction = Buffer.from(
        response.signedTransaction
      ).toString("base64");
      return signedTransaction;
    } else if (response.error) {
      throw new Error(`Transaction signing failed: ${response.error}`);
    } else if (!response.success) {
      throw new Error(
        "Transaction signing was cancelled or rejected. Please check your wallet."
      );
    }

    return null;
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
    const topic = saveData.topic;

    if (!topic) {
      throw new Error(
        "HashConnect is not properly initialized. Topic is missing. Please reconnect your wallet."
      );
    }

    if (!saveData.privateKey) {
      throw new Error(
        "HashConnect is not properly initialized. Private key is missing. Please reconnect your wallet."
      );
    }

    // Ensure HashConnect is initialized with private key for encryption
    // This is required before sending transactions
    try {
      await hashConnect.init(metadata ?? APP_CONFIG, saveData.privateKey);
    } catch (error: any) {
      // If already initialized, that's fine - continue
      if (!error.message?.includes("already initialized")) {
        console.warn("HashConnect init warning:", error.message);
      }
    }

    const transaction: MessageTypes.Transaction = {
      topic: topic,
      byteArray: trans,
      metadata: {
        accountToSign: acctToSign,
        returnTransaction: return_trans,
      },
    };

    const response = await hashConnect.sendTransaction(topic, transaction);
    return response;
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
