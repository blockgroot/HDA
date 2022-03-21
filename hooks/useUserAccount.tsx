import React, { useState, useEffect } from "react";
import useHashConnect from "./useHashConnect";
import TokenRelationship from "@hashgraph/sdk/lib/account/TokenRelationship";
import { tokenId } from "context/HashConnectProvider";

export default function useAccount() {
  const { accountInfo } = useHashConnect();
  const [isAsocciated, setIsAssociated] = useState<boolean>(false);
  const [hbarX, setHbarX] = useState<number>(0);
  const [hbar, setHbar] = useState<number>(0);
  const [accountId, setAccountId] = useState<string>("");

  useEffect(() => {
    if (accountInfo) {
      setHbar(accountInfo.balance.toBigNumber().toNumber());
      setAccountId(accountInfo.accountId.toString());
      const _isAssociated: boolean =
        accountInfo.tokenRelationships._map.has(tokenId);
      setIsAssociated(_isAssociated);
      console.log("isAssociated", _isAssociated);
      if (_isAssociated) {
        const tokenRelationship: TokenRelationship =
          accountInfo.tokenRelationships._map.get(tokenId) as TokenRelationship;
        console.log("tokenRelationship", tokenRelationship.balance.toNumber());
        setHbarX(tokenRelationship.balance.toNumber());

        //setHbarX(accountInfo.tokenRelationships._map.get(tokenId).hbarX);
      }
    }
  }, [accountInfo]);

  return { hbarX, isAsocciated, hbar, accountId };
}
