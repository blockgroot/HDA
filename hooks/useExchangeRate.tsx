import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useHashConnect from "./useHashConnect";
import { config } from "config/config";
import { tokenId, apiPath } from "@constants/constants";

export default function useExchangeRate() {
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const { tvl } = useHashConnect();

  const { data } = useQuery("tokenData", () =>
    fetch(`${config.network.url}${apiPath}tokens/${tokenId}`).then((res) =>
      res.json()
    )
  );

  useEffect(() => {
    if (data) {
      console.log(data);
      setTotalSupply(data.total_supply);
    }
  }, [data]);

  return { exchangeRate: totalSupply ? totalSupply / tvl : 0 };
}
