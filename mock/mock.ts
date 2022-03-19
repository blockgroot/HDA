import { Client } from "@hashgraph/sdk";
import { useMemo } from "react";

export const MY_ACCOUNT_ID = "0.0.30860087";
export const MY_PRIVATE_KEY = "302e020100300506032b657004220420a08db46ce12b14268309acc935b0ecd5a9890e7be3cebf0ad26fea89ccdce32c";
export const TOKEN_ID = "0.0.33975310"; //HBX;

export function useMockAccount() {
  return useMemo(() => ({
    accountId: MY_ACCOUNT_ID,
    privateKey: MY_PRIVATE_KEY
  }), []);
}

export function useTestnetClient(account) {
  return useMemo(() => {

    const client = Client.forTestnet();
    client.setOperator(account.accountId, account.privateKey);

    return client;
  }, [account]);
}