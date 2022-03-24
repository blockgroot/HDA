import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useHashConnect from "./useHashConnect";
import { config } from "config/config";
import { tokenId, apiPath } from "@constants/constants";

export default function useExchangeRate() {
  //   const [totalSupply, setTotalSupply] = useState<number>(0);
  const { tvl } = useHashConnect();
  const [exchangeRate, setExchangeRate] = useState<number>(1);

  const { data } = useQuery("tokenData", () =>
    fetch(`${config.network.url}${apiPath}tokens/${tokenId}`).then((res) =>
      res.json()
    )
  );

  useEffect(() => {
    if (data) {
      console.log("data", data);
      if (tvl != 0 && data.total_supply != 0) {
        setExchangeRate(data.total_supply / tvl);
      } else {
        setExchangeRate(1);
      }
    }
  }, [data, tvl]);

  return { exchangeRate };
}
