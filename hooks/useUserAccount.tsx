import { tokenId } from "context/HashConnectProvider";
import { useEffect, useState } from "react";
import useHashConnect from "./useHashConnect";

export default function useAccount() {
  const { accountBalance } = useHashConnect();
  const [hbarX, setHbarX] = useState<number>(0);
  const [hbar, setHbar] = useState<number>(0);

  useEffect(() => {
    if (accountBalance) {
      // console.log(accountBalance);
      setHbar(accountBalance.hbars.toTinybars().toNumber());
      const _isAssociated = accountBalance.tokens?._map.has(tokenId);
      if (_isAssociated) {
        const token = accountBalance.tokens?._map.get(tokenId);
        setHbarX(token?.toNumber() || 0);
      }
    }
  }, [accountBalance]);

  return { hbarX, hbar };
}
