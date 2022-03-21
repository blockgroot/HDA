import { useEffect, useState } from "react";
import useHashConnect from "./useHashConnect";

export default function useStake() {
  const { accountInfo } = useHashConnect();

  const [hbarX, setHbarX] = useState<number>(0);
  const [hbar, setHbar] = useState<number>(0);
  const [accountId, setAccountId] = useState<string>("");

  useEffect(() => {
    if (accountInfo) {
      setHbar(accountInfo.balance.toBigNumber().toNumber());
      setAccountId(accountInfo.accountId.toString());
    }
  }, [accountInfo]);

  return { hbarX, hbar, accountId };
}
