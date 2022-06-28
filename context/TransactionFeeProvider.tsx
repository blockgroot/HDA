import {
  NATIVE_TOKEN_MULTIPLIER,
  precision,
  ratesAPI,
  usdTransactionFee,
} from "@constants/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface PropsType {
  children: React.ReactNode;
}

type TransactionFeeProviderAPI = {
  usdRate: number;
  fee: number;
};

type RatesApiResponse = {
  "hedera-hashgraph": {
    usd: number;
  };
};

export const TransactionFeeContext =
  React.createContext<TransactionFeeProviderAPI>({
    usdRate: 0,
    fee: 0,
  });

export default function TransactionFeeProvider({ children }: PropsType) {
  const [usdRate, setUsdRate] = useState<number | undefined>(undefined);
  const [transactionFee, setTransactionFee] = useState<number>(0);

  // fetch rates
  useEffect(() => {
    axios
      .get<RatesApiResponse>(ratesAPI)
      .then((response) => response.data)
      .then((data) => setUsdRate(data["hedera-hashgraph"].usd));
  }, []);

  useEffect(() => {
    if (usdRate !== undefined) {
      setTransactionFee(
        parseFloat((usdTransactionFee / usdRate).toFixed(precision))
      );
    }
  }, [usdRate]);

  return (
    <TransactionFeeContext.Provider
      value={{
        usdRate: usdRate ?? 0,
        fee: transactionFee * NATIVE_TOKEN_MULTIPLIER,
      }}
    >
      {children}
    </TransactionFeeContext.Provider>
  );
}
