import {
  ContractExecuteTransaction,
  Hbar,
  ContractFunctionParameters,
  AccountInfoQuery,
  AccountInfo,
  TokenAssociateTransaction,
  AccountId,
  TransactionReceipt,
  Transaction,
  TokenDissociateTransaction,
  ContractInfoQuery,
} from "@hashgraph/sdk";
import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { makeBytes, signAndMakeBytes, init } from "../services/signing.service";

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
  connect: () => void;
  associateToken: () => void;
  accountInfo: AccountInfo | null;
  walletData: SaveData;
  network: Networks;
  metadata?: HashConnectTypes.AppMetadata;
  installedExtensions: HashConnectTypes.WalletMetadata | null;
  status: string;
  stake: (amount: number) => void;
  tvl: number;
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
  console.log("loadLocalData", localStorage.getItem(SAVE_KEY));
  let foundData = localStorage.getItem(SAVE_KEY);
  console.log("foundData", foundData);

  if (foundData) {
    const saveData: SaveData = JSON.parse(foundData);
    // setSaveData(saveData);
    return saveData;
  } else return null;
};

export const HashConnectAPIContext =
  React.createContext<HashConnectProviderAPI>({
    connect: () => null,
    associateToken: () => null,
    accountInfo: {} as AccountInfo,
    walletData: INITIAL_SAVE_DATA,
    network: "testnet",
    installedExtensions: null,
    status: "INITIALIZING",
    stake: () => null,
    tvl: 0,
  });

//fetch this from config/move to config
export const tokenId = "0.0.30873456";
export const contractId = "0.0.30873462";

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
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [tvl, setTvl] = useState<number>(0);
  // const [accountId, setAccountId] = useState<string | null>();

  const [status, _setStatus] = useState<string>("INITIALIZING");

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

    console.log("localData", localData);
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
        if (debug) console.log("====Local data found====", localData);
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
        await getAccounts(localData.accountIds[0]);
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
    setStatus("WALLET_NOT_CONNECTED");
    setInstalledExtensions(data as HashConnectTypes.WalletMetadata);
  };

  const pairingEventHandler = (data: MessageTypes.ApprovePairing) => {
    if (debug) console.log("===Wallet connected=====", data);
    // Save Data to localStorage

    saveDataInLocalStorage(data);
  };

  const transactionResponseHandler = async (
    data: MessageTypes.TransactionResponse
  ) => {
    console.log("received data", data);
    if (data.success && !data.signedTransaction)
      console.log(TransactionReceipt.fromBytes(data.receipt as Uint8Array));
    else if (data.success && data.signedTransaction)
      console.log(Transaction.fromBytes(data.signedTransaction as Uint8Array));

    console.log("saveData", saveData);
    console.log("saveDataRef", saveDataRef.current);
    getAccounts(saveDataRef.current.accountIds[0]);
    getTvl();
  };

  useEffect(() => {
    hashConnect.additionalAccountResponseEvent.on(
      additionalAccountResponseEventHandler
    );
    hashConnect.foundExtensionEvent.on(foundExtensionEventHandler);
    hashConnect.pairingEvent.on(pairingEventHandler);
    hashConnect.transactionResponseEvent.on(transactionResponseHandler);
    //Intialize the setup
    initializeHashConnect();
    getTvl();
    // Attach event handlers

    return () => {
      // Detach existing handlers
      hashConnect.additionalAccountResponseEvent.off(
        additionalAccountResponseEventHandler
      );
      hashConnect.foundExtensionEvent.off(foundExtensionEventHandler);
      hashConnect.pairingEvent.off(pairingEventHandler);
      hashConnect.transactionResponseEvent.off(transactionResponseHandler);
    };
  }, []);

  useEffect(() => {
    console.log("installedExtensions2", installedExtensions);
  }, [installedExtensions]);

  useEffect(() => {
    console.log("status", status);
  }, [status]);

  const connect = async () => {
    console.log("installedExtensions", installedExtensions);
    await hashConnect.connectToLocalWallet(saveData?.pairingString);
    // if (installedExtensions) {
    //   if (debug) console.log("Pairing String::", saveData.pairingString);
    //   await hashConnect.connectToLocalWallet(saveData?.pairingString);
    // } else {
    //   if (debug) console.log("====No Extension is not in browser====");
    //   return "wallet not installed";
    // }
  };

  const getTvl = async () => {
    //Create the query
    const query = new ContractInfoQuery().setContractId(contractId);
    const client = await init();

    //Sign the query with the client operator private key and submit to a Hedera network
    const contractInfo = await query.execute(client);

    console.log(contractInfo);
    setTvl(contractInfo.balance.toTinybars().toNumber());
  };

  const getAccounts = async (accountId: string) => {
    //Create the account info query
    //moved to api
    const query = new AccountInfoQuery().setAccountId(accountId);
    const client = await init();

    // Sign with client operator private key and submit the query to a Hedera network
    const accountInfo = await query.execute(client);

    // Print the account info to the console
    console.log(accountInfo);

    //v2.0.0
    // setBalance(accountInfo.balance.toTinybars().toString());
    setAccountInfo(accountInfo);
    setStatus("WALLET_CONNECTED");
  };

  const stake = async (amount: number) => {
    console.log("staked Amount", amount);
    const accountId: AccountId = AccountId.fromString(saveData?.accountIds[0]);

    const transaction = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(600_000)
      .setPayableAmount(amount)
      .setFunction(
        "stake",
        new ContractFunctionParameters().addAddress(
          accountId.toSolidityAddress()
        )
      );

    const transactionBytes = await signAndMakeBytes(
      transaction,
      accountId.toString()
    );
    console.log("transactionBytes", transactionBytes);

    await sendTransaction(transactionBytes, accountId.toString(), false);
  };

  const associateToken = async () => {
    //Associate a token to an account and freeze the unsigned transaction for signing
    // const client = await init();
    // const accountId = AccountId.fromString(accountInfo?.accountIds[0]);
    console.log("associateToken");
    const accountId = saveData?.accountIds[0];
    const transaction = await new TokenAssociateTransaction()
      .setAccountId(accountId)
      .setTokenIds([tokenId]);

    const transactionBytes = await makeBytes(transaction, accountId);
    console.log("transactionBytes", transactionBytes);

    await sendTransaction(transactionBytes, accountId, false);
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
    const newTx = await hashConnect.sendTransaction(topic, transaction);
    console.log("transaction sent", newTx);
  };

  return (
    <HashConnectAPIContext.Provider
      value={{
        connect,
        associateToken,
        accountInfo,
        walletData: saveData,
        network: network,
        installedExtensions,
        status,
        stake,
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
