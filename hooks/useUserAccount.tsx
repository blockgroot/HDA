import { config } from "config/config";
import { useEffect, useState } from "react";
import useHashConnect from "./useHashConnect";

export default function useAccount() {
  const { accountBalance } = useHashConnect();
  const [hbarX, setHbarX] = useState<number>(0);
  const [hbar, setHbar] = useState<number>(0);

  useEffect(() => {
    if (accountBalance) {
      setHbar(accountBalance.hbars.toTinybars().toNumber());
      const _isAssociated = accountBalance.tokens?._map.has(config.ids.tokenId);
      if (_isAssociated) {
        const token = accountBalance.tokens?._map.get(config.ids.tokenId);
        setHbarX(token?.toNumber() || 0);
      } else {
        setHbarX(0);
      }
    }
  }, [accountBalance]);

  return { hbarX, hbar };
}
