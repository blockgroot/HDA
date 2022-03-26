import { emissionRate, NATIVE_TOKEN_MULTIPLIER } from "@constants/constants";
import { useEffect, useState } from "react";
import useHashConnect from "./useHashConnect";

export default function useAPY() {
  const [apy, setAPY] = useState<number>(100);
  const { tvl } = useHashConnect();

  useEffect(() => {
    if (tvl > 0) {
      setAPY((emissionRate * NATIVE_TOKEN_MULTIPLIER * 31536000) / (tvl * 100));
    }
    //
  }, [tvl]);

  return { apy };
}
