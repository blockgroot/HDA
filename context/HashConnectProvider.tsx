import {
  AccountBalance,
  AccountBalanceQuery,
  AccountId,
  Client,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Transaction,
  TransactionId,
  TransactionReceipt,
} from "@hashgraph/sdk";
import { WalletStatus } from "@molecules/WalletSelector/WalletSelector";
import { config } from "config/config";
import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import React, { useEffect, useRef, useState } from "react";

//Type declarations
interface SaveData {
  topic: string;
  pairingString: string;
  privateKey: string;
  pairedWalletData: HashConnectTypes.WalletMetadata | null;
  pairedAccounts: string[];
  network?: string;
  id?: string;
  accountIds?: string[];
}

type Networks = "testnet" | "mainnet" | "previewnet";

declare var chrome: any;

interface PropsType {
  children: React.ReactNode;
  hashConnect: HashConnect;
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
  isExtensionInstalled: boolean;
  status: string;
  stake: (amount: number) => void;
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
};

// export declare enum WalletStatus {
//   INITIALIZING = "INITIALIZING",
//   WALLET_NOT_CONNECTED = "WALLET_NOT_CONNECTED",
//   WALLET_CONNECTED = "WALLET_CONNECTED",
// }

let APP_CONFIG: HashConnectTypes.AppMetadata = {
  name: "Stader| Staking HBAR Simplified",
  description:
    "Liquid staking with Stader. Stake HBAR with Stader to earn rewards while keeping full control of your staked tokens. Start earning rewards in just a few clicks",
  icon: "https://hedera.staderlabs.com/hbarx.png",
};

const SAVE_KEY = `hashConnectData/${config.network.name}`;

const loadLocalData = (): null | SaveData => {
  // console.log("loadLocalData", localStorage.getItem(SAVE_KEY));
  let foundData = localStorage.getItem(SAVE_KEY);
  // console.log("foundData", foundData);

  if (foundData) {
    const saveData: SaveData = JSON.parse(foundData);
    // setSaveData(saveData);
    return saveData;
  } else return null;
};

export const HashConnectAPIContext =
  React.createContext<HashConnectProviderAPI>({
    connect: (type: ConnectType) => null,
    disconnect: () => null,
    accountBalance: null,
    selectedAccount: "",
    isExtensionInstalled: false,
    walletData: INITIAL_SAVE_DATA,
    network: config.network.name as Networks,
    installedExtensions: null,
    status: "INITIALIZING",
    stake: () => null,
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

export default function HashConnectProvider({
  children,
  hashConnect,
  metadata: metadata,
  network: network,
  debug,
}: PropsType) {
  debug = true;
  //Saving Wallet Details in Ustate
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

  const [status, _setStatus] = useState<string>(WalletStatus.INITIALIZING);
  const [transactionStatus, setTransActionStatus] = useState<string>("");
  const [networkError, setNetworkError] = useState<boolean>(false);

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
    const localData = loadLocalData();

    // console.log("localData", localData);
    try {
      if (!localData) {
        if (debug) console.log("===Local data not found.=====");

        //first init and store the private for later
        let initData = await hashConnect.init(metadata ?? APP_CONFIG);
        saveData.privateKey = initData.privKey;

        //then connect, storing the new topic for later
        const state = await hashConnect.connect();
        saveData.topic = state.topic;
        console.log({ state });
        //generate a pairing string, which you can display and generate a QR code from
        saveData.pairingString = hashConnect.generatePairingString(
          state,
          network,
          debug ?? false
        );

        //find any supported local wallets
        hashConnect.findLocalWallets();
        setTimeout(() => {
          if (!isExtensionInstalled) {
            setStatus(WalletStatus.WALLET_NOT_CONNECTED);
          }
        }, 5000);
      } else {
        // if (debug) console.log("====Local data found====", localData);
        //use loaded data for initialization + connection
        await hashConnect.init(metadata ?? APP_CONFIG, localData?.privateKey);
        setInstalledExtensions(localData?.pairedWalletData);
        const state = await hashConnect.connect(
          localData?.topic,
          localData?.pairedWalletData ?? metadata
        );
      }
    } catch (error) {
      setNetworkError(true);
      console.log("error found", error);
    } finally {
      if (localData) {
        setSaveData({ ...saveData, ...localData });
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
  };

  const saveDataInLocalStorage = async (data: MessageTypes.ApprovePairing) => {
    if (debug)
      console.info("===============Saving to localstorage::=============");
    const { metadata, ...restData } = data;
    const saveObj = {
      ...saveData,
      pairedWalletData: metadata,
      pairedAccounts: restData.accountIds,
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
    // setAccountId(restData.accountIds[0]);

    let dataToSave = JSON.stringify(saveObj);
    localStorage.setItem(SAVE_KEY, dataToSave);
    setSelectedAccount(saveObj.accountIds[0]);
    await getAccounts(saveObj.accountIds[0]);
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
    setStatus(WalletStatus.WALLET_NOT_CONNECTED);
    setInstalledExtensions(data as HashConnectTypes.WalletMetadata);
  };

  const pairingEventHandler = (data: MessageTypes.ApprovePairing) => {
    if (debug) console.log("===Wallet connected=====", data);
    // Save Data to localStorage

    saveDataInLocalStorage(data);
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
    hashConnect.foundExtensionEvent.once(foundExtensionEventHandler);
    hashConnect.pairingEvent.on(pairingEventHandler);
    hashConnect.transactionEvent.on(transactionHandler);
    hashConnect.connectionStatusChange.on((connectionStatus) => {
      //do something with connection status
      console.log("connectionStatus", connectionStatus);
    });
    hashConnect.acknowledgeMessageEvent.once((acknowledgeData) => {
      //do something with acknowledge response data
      console.log("acknowledgeData", acknowledgeData);
    });
    hashConnect.transactionResolver = () => {};
    //
    //Intialize the setup
    getTvl();
    initializeHashConnect();

    // Attach event handlers

    return () => {
      // Detach existing handlers

      hashConnect.foundExtensionEvent.off(foundExtensionEventHandler);
      hashConnect.pairingEvent.off(pairingEventHandler);
      hashConnect.transactionEvent.off(transactionHandler);
    };
  }, []);

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

    if (installedExtensions) {
      if (debug) console.log("Pairing String::", saveData.pairingString);
      hashConnect.connectToLocalWallet(saveData?.pairingString);
    } else {
      if (debug) console.log("====No Extension is not in browser====");
      window.open(config.extension_url, "_blank");
    }
  };

  const disconnect = () => {
    console.log("disconnect");
    setSaveData(INITIAL_SAVE_DATA);
    setStatus(WalletStatus.WALLET_NOT_CONNECTED);
    // setInstalledExtensions(null);
    localStorage.removeItem(SAVE_KEY);
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
      console.log(balance);

      setTvl(balance.hbars.toTinybars().toNumber());
    } catch (error: any) {
      setNetworkError(true);
      console.log(error.message);
    }
  };

  const getAccounts = async (accountId: string) => {
    //Create the account info query
    //moved to api
    try {
      const query = new AccountBalanceQuery().setAccountId(accountId);

      // const balance =  (await provider.getBalance(accountId)).toNumber();

      const client = Client.forName(config.network.name);
      // Sign with client operator private key and submit the query to a Hedera network
      const balance = await query.execute(client);

      setAccountBalance(balance);
      setStatus("WALLET_CONNECTED");
    } catch (error: any) {
      setNetworkError(true);
      console.log(error.message);
    }
  };

  const signTransaction = async (transactionString: string) => {
    // console.log("transactionString", transactionString);
    const transaction = Buffer.from(transactionString, "base64");

    // console.log("transaction", transaction.buffer);

    const response: MessageTypes.TransactionResponse = await sendTransaction(
      transaction,
      selectedAccount,
      true
    );

    // console.log("response", response);
    if (response.success && response.signedTransaction) {
      // console.log("signedTransaction", signedTransaction);

      const signedTransaction = Buffer.from(
        response.signedTransaction
      ).toString("base64");
      // console.log(encodedSignature);
      // const output: signedTransactionParams = {
      //   userId: selectedAccount,
      //   signature: encodedSignature,
      // };
      // console.log("output", output);
      return signedTransaction;
    }

    return null;
  };

  const stake = async (amount: number) => {
    console.log("staked Amount", amount);
    setTransActionStatus("START");

    const accountId: AccountId = AccountId.fromString(
      selectedAccount as string
    );

    let transId = TransactionId.generate(accountId);

    const transaction = new ContractExecuteTransaction()
      .setContractId(config.ids.stakingContractId)
      .setGas(2_000_000)
      .setPayableAmount(amount)
      .setFunction(
        "stake",
        new ContractFunctionParameters().addAddress(
          accountId.toSolidityAddress()
        )
      )
      .setNodeAccountIds([new AccountId(3)])
      .setTransactionId(transId)
      .freeze();

    const transactionBytes = transaction.toBytes();

    const response: MessageTypes.TransactionResponse = await sendTransaction(
      transactionBytes,
      accountId.toString(),
      false
    );

    if (response.success) {
      setTransActionStatus("SUCCESS");
    }

    if (response.success && !response.signedTransaction)
      console.log(TransactionReceipt.fromBytes(response.receipt as Uint8Array));
    else if (response.success && response.signedTransaction)
      console.log(
        Transaction.fromBytes(response.signedTransaction as Uint8Array)
      );
    else {
      setTransActionStatus("FAILED");
    }

    // console.log("saveData", saveData);
    // console.log("saveDataRef", saveDataRef.current);
    getAccounts(accountId.toString());
    getTvl();
    //  hashConnect.transactionResponseEvent.on(transactionResponseHandler);
  };

  const sendTransaction = async (
    trans: Uint8Array,
    acctToSign: string,
    return_trans: boolean = false
  ) => {
    const topic = saveData.topic;
    const transaction: MessageTypes.Transaction = {
      topic: topic,
      byteArray: trans,

      metadata: {
        accountToSign: acctToSign,
        returnTransaction: return_trans,
      },
    };
    const response = await hashConnect.sendTransaction(topic, transaction);
    // console.log("transaction sent", response);
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
        isExtensionInstalled,
        status,
        stake,
        transactionStatus,
        setTransActionStatus,
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
    name: "Stader | Staking HBAR Simplified",
    description:
      "Liquid staking with Stader. Stake HBAR with Stader to earn rewards while keeping full control of your staked tokens. Start earning rewards in just a few clicks",
    icon: "https://hedera.staderlabs.com/hbarx.png",
  },
  network: config.network.name as Networks,
  debug: false,
};

HashConnectProvider.defaultProps = defaultProps;
