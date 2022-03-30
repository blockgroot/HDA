import { emissionRate } from "@constants/constants";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import { useEffect, useState } from "react";
import useHashConnect from "./useHashConnect";

export default function useAPY() {
  const [apy, setAPY] = useState<number>(100);
  const { tvl } = useHashConnect();

  useEffect(() => {
    if (tvl > 0) {
      const apy = (emissionRate * 365 * 100) / tvl;
      setAPY(apy);
    }
    //
  }, [tvl]);

  return { apy };
}
