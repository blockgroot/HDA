import { useEffect, useState } from "react";
import { config } from "../config/config";
import { getLunaPrice } from "@services/currency";
import { useAppContext } from "@libs/appContext";
import { useQuery } from "react-query";
import { TvlType } from "@types_/liquid-staking-pool";
import { LUNA_MULTIPLIER } from "@constants/constants";
import { LS_TVL } from "@constants/queriesKey";

const { liquidStaking: contractAddress } = config.contractAddresses;

const useLSPoolsEstimate = () => {
  const { terra } = useAppContext();

  const [tvl, setTvl] = useState<TvlType>({
    uluna: 0,
    valueInUSD: 0,
    exchangeRate: 0,
  });

  const fetchTvl = async (contractAddress: string) => {
    try {
      const contractState = await terra.wasm.contractQuery(contractAddress, {
        state: {},
      });

      const lunaPrice: any = await getLunaPrice();

      const totalStaked = Number(contractState.state.total_staked ?? 0);
      const exchangeRate = Number(contractState.state.exchange_rate ?? 0);
      const usdRate = Number(lunaPrice.amount ?? 0);
      return {
        uluna: totalStaked,
        exchangeRate,
        valueInUSD: (totalStaked * usdRate) / LUNA_MULTIPLIER,
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
