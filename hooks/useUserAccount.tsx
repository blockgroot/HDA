import React, { useState, useEffect } from "react";
import useHashConnect from "./useHashConnect";
import TokenRelationship from "@hashgraph/sdk/lib/account/TokenRelationship";
import { tokenId } from "context/HashConnectProvider";

export default function useAccount() {
  const { accountInfo } = useHashConnect();
  const [hbarX, setHbarX] = useState<number>(0);
  const [hbar, setHbar] = useState<number>(0);
  const [accountId, setAccountId] = useState<string>("");

  useEffect(() => {
    if (accountInfo) {
      setHbar(accountInfo.balance.toBigNumber().toNumber());
      setAccountId(accountInfo.accountId.toString());
      const _isAssociated: boolean =
        accountInfo.tokenRelationships._map.has(tokenId);

      if (_isAssociated) {
        const tokenRelationship: TokenRelationship =
          accountInfo.tokenRelationships._map.get(tokenId) as TokenRelationship;
        setHbarX(tokenRelationship.balance.toNumber());
      }
    }
  }, [accountInfo]);

  return { hbarX, hbar, accountId };
}
