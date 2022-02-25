import { useEffect, useState } from "react";

import { config } from "../config/config";
import { defaultAirdrops } from "../constants/constants";
import { useAppContext } from "../libs/appContext";
import { useQuery } from "react-query";
import { AirdropsArrayType } from "../@types/airdrops";
import { LS_AIRDROP } from "@constants/queriesKey";

const { airdropsContract } = config.contractAddresses;

function useAirdrops() {
  const { terra, walletAddress } = useAppContext();

  const [airdrops, setAirdrops] = useState<AirdropsArrayType[]>([]);

  const fetchAirdrops = async (walletAddress: string) => {
    try {
      return await terra.wasm.contractQuery(airdropsContract, {
        get_user_token_info: {
          user: walletAddress,
        },
      });
    } catch (e) {
      return e;
    }
  };

  const { refetch, isLoading } = useQuery(
    [LS_AIRDROP, walletAddress],
    () => fetchAirdrops(walletAddress),
    {
      onSuccess: (res) => {
        const totalAirdrops: AirdropsArrayType[] =
          res && res.user_tokens && res.user_tokens.length > 0
            ? res.user_tokens
            : defaultAirdrops;
        console.log(res);
        setAirdrops(totalAirdrops);
      },
    }
  );

  useEffect(() => {
    if (walletAddress) {
      refetch();
    }
  }, [walletAddress]);

  return { airdrops, isLoading };
}

export default useAirdrops;
