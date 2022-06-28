import { apiPath } from "@constants/constants";
import axios from "axios";
import { config } from "config/config";
import { useEffect, useState } from "react";
import useHashConnect from "./useHashConnect";

let isFirstTime = true;
export default function useExchangeRate() {
  //   const [totalSupply, setTotalSupply] = useState<number>(0);
  const { tvl } = useHashConnect();
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  // const [totalSupply, setTotalSupply] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  const updateExchangeRate = async () => {
    try {
      const response: any = await axios.get(
        `${config.network.url}${apiPath}tokens/${config.ids.tokenId}`
      );

      if (response?.data) {
        setError(false);
        if (tvl != 0 && response.data.total_supply != 0) {
          setExchangeRate(response.data.total_supply / tvl);
        }
      } else {
        console.error("error");
        setError(true);
      }
    } catch (err) {
      // Handle Error Here
      setError(true);
      console.error("error", err);
    }
  };

  useEffect(() => {
    if (tvl > 0) {
      // getTotalSupply();
      setTimeout(
        () => {
          isFirstTime = false;
          updateExchangeRate();
        },
        isFirstTime ? 0 : 10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tvl]);

  return { exchangeRate, updateExchangeRate, error };
}
