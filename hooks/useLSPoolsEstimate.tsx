import { useEffect, useState } from "react";
import { config } from "../config/config";
import { getNativeTokenPrice } from "@services/currency";
import { useAppContext } from "@libs/appContext";
import { useQuery } from "react-query";
import { TvlType } from "@types_/liquid-staking-pool";
import { NATIVE_TOKEN_MULTIPLIER } from "@constants/constants";
import { LS_TVL } from "@constants/queriesKey";

const { liquidStaking: contractAddress } = config.contractAddresses;

const useLSPoolsEstimate = () => {
  const { terra } = useAppContext();

  const [tvl, setTvl] = useState<TvlType>({
    uNativeToken: 0,
    valueInUSD: 0,
    exchangeRate: 0,
  });

  const fetchTvl = async (contractAddress: string) => {
    try {
      const contractState = await terra.wasm.contractQuery(contractAddress, {
        state: {},
      });

      const nativeTokenPrice: any = await getNativeTokenPrice();

      const totalStaked = Number(contractState.state.total_staked ?? 0);
      const exchangeRate = Number(contractState.state.exchange_rate ?? 0);
      const usdRate = Number(nativeTokenPrice.amount ?? 0);
      return {
        uNativeToken: totalStaked,
        exchangeRate,
        valueInUSD: (totalStaked * usdRate) / NATIVE_TOKEN_MULTIPLIER,
      };
    } catch (e: any) {
      throw new Error(e);
    }
  };

  const tvlQuery = useQuery(
    [LS_TVL, contractAddress],
    () => fetchTvl(contractAddress),
    {
      enabled: false,
      onSuccess: (res: TvlType) => {
        setTvl(res);
      },
    }
  );

  useEffect(() => {
    tvlQuery.refetch();
  }, []);

  return {
    tvl,
    tvlLoading: tvlQuery.isLoading,
  };
};

export default useLSPoolsEstimate;
