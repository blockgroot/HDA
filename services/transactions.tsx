import { config } from "../config/config";
import {
  GET_ALL_USER_TRANSACTION_URL,
  SAVE_TRANSACTION_URL,
} from "../constants/constants";
import request from "./client";

interface TxPayload {
  transactionType: string;
  coins: any;
  txhash: string;
  userAddress: string;
  poolId?: string;
  strategyId?: string;
}

export const saveTransaction = async (payload: TxPayload) => {
  let authParams = {
    url: SAVE_TRANSACTION_URL,
    data: {
      ...payload,
      staderHub: config.contractAddresses.staderHub,
    },
  };

  const response = await request("post", authParams);
  return response;
};

export const getTransactions = async (userAddress: string) => {
  let authParams = {
    url: GET_ALL_USER_TRANSACTION_URL,
    data: {
      userAddress,
      staderHub: config.contractAddresses.staderHub,
    },
  };

  const response = await request("post", authParams);
  return response.data;
};
