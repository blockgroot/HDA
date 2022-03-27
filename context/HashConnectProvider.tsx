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
import axios from "axios";
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
  status: string;
  stake: (amount: number) => void;
  transactionStatus: string;
  setTransActionStatus: (status: string) => void;
  tvl: number;
}

export enum ConnectType {
  CHROME_EXTENSION,
  BLADE_WALLET,
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
  name: "Hedera Staking DApp",
  description: "Stake Hbars",
  icon: "https://www.hashpack.app/img/logo.svg",
};

const SAVE_KEY = "hashConnectData";

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
    walletData: INITIAL_SAVE_DATA,
    network: "testnet",
    installedExtensions: null,
    status: "INITIALIZING",
    stake: () => null,
    transactionStatus: "",
    setTransActionStatus: () => null,
    tvl: 0,
  });

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
  const [accountBalance, setAccountBalance] = useState<AccountBalance | null>(
    null
  );
  const [tvl, setTvl] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  const [status, _setStatus] = useState<string>(WalletStatus.INITIALIZING);
  const [transactionStatus, setTransActionStatus] = useState<string>("");

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

        //generate a pairing string, which you can display and generate a QR code from
        saveData.pairingString = hashConnect.generatePairingString(
          state,
          network,
          debug ?? false
        );

        //find any supported local wallets
        hashConnect.findLocalWallets();
      } else {
        // if (debug) console.log("====Local data found====", localData);
        //use loaded data for initialization + connection
        await hashConnect.init(metadata ?? APP_CONFIG, localData?.privateKey);
        setInstalledExtensions(localData?.pairedWalletData);
        await hashConnect.connect(
          localData?.topic,
          localData?.pairedWalletData ?? metadata
        );
      }
    } catch (error) {
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

  // const transactionResponseHandler = async (
  //   data: MessageTypes.TransactionResponse
  // ) => {
  //   console.log("received data", data);
  //   if (data.success && !data.signedTransaction)
  //     console.log(TransactionReceipt.fromBytes(data.receipt as Uint8Array));
  //   else if (data.success && data.signedTransaction)
  //     console.log(Transaction.fromBytes(data.signedTransaction as Uint8Array));

  //   console.log("saveData", saveData);
  //   console.log("saveDataRef", saveDataRef.current);
  //   // getAccounts(saveDataRef.current.accountIds[0]);
  //   // getTvl();
  // };

  const transactionHandler = (data: MessageTypes.Transaction) => {
    // console.log("received data", data);
  };

  useEffect(() => {
    hashConnect.foundExtensionEvent.once(foundExtensionEventHandler);
    hashConnect.pairingEvent.on(pairingEventHandler);
    hashConnect.transactionEvent.on(transactionHandler);
    hashConnect.transactionResolver = () => {};
    //
    //Intialize the setup
    initializeHashConnect();
    getTvl();
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
    console.log({ type, installedExtensions });
    // if (type === ConnectType.CHROME_EXTENSION) {
    await hashConnect.connectToLocalWallet(saveData?.pairingString);
    // }
    // if (installedExtensions) {
    //   if (debug) console.log("Pairing String::", saveData.pairingString);
    //   await hashConnect.connectToLocalWallet(saveData?.pairingString);
    // } else {
    //   if (debug) console.log("====No Extension is not in browser====");
    //   return "wallet not installed";
    // }
  };

  const disconnect = () => {
    console.log("disconnect");
    // setSaveData(INITIAL_SAVE_DATA);
    setStatus(WalletStatus.WALLET_NOT_CONNECTED);
    // setInstalledExtensions(null);
    localStorage.removeItem(SAVE_KEY);
  };

  const getTvl = async () => {
    //Create the query
    const query = new AccountBalanceQuery().setContractId(
      config.ids.syakingContractId
    );

    const client = Client.forName(config.network.name);

    //Sign the query with the client operator private key and submit to a Hedera network
    const balance = await query.execute(client);
    // console.log(balance);

    // console.log(contractInfo);
    setTvl(balance.hbars.toTinybars().toNumber());
  };

  const getAccounts = async (accountId: string) => {
    //Create the account info query
    //moved to api
    const query = new AccountBalanceQuery().setAccountId(accountId);

    // const balance =  (await provider.getBalance(accountId)).toNumber();

    const client = Client.forName(config.network.name);
    // Sign with client operator private key and submit the query to a Hedera network
    const balance = await query.execute(client);

    setAccountBalance(balance);
    setStatus("WALLET_CONNECTED");
  };

  //TODO: move this code
  const sendPostRequest = async (bytes: Uint8Array) => {
    try {
      //TODO: Move this to url
      const resp: any = await axios.post(config.stakeApi, {
        transactionBytes: bytes,
      });
      // console.log("responseee", resp.data.result.data);
      if (resp.data.result) {
        return resp.data.result.data as Uint8Array;
      }
    } catch (err) {
      // Handle Error Here

      console.error("error", err);
    }
  };

  const stake = async (amount: number) => {
    console.log("staked Amount", amount);
    setTransActionStatus("START");

    const accountId: AccountId = AccountId.fromString(
      selectedAccount as string
    );

    let transId = TransactionId.generate(accountId);

    const transaction = new ContractExecuteTransaction()
      .setContractId(config.ids.syakingContractId)
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

    const transBytes = transaction.toBytes();
    const sendTx = await sendPostRequest(transBytes);

    if (!sendTx) {
      setTransActionStatus("FAILED");
      return;
    }

    const transactionBytes = new Uint8Array(sendTx as Uint8Array);

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
        status,
        stake,
        transactionStatus,
        setTransActionStatus,
        tvl,
      }}
    >
      {children}
    </HashConnectAPIContext.Provider>
  );
}

const defaultProps: Partial<PropsType> = {
  metadata: {
    name: "Hedera Staking DApp",
    description: "Stake Hbars",
    icon: "https://www.hashpack.app/img/logo.svg",
  },
  network: "testnet",
  debug: false,
};

HashConnectProvider.defaultProps = defaultProps;
