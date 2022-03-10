import React from "react";
import MainLayout from "../layout";
import LSPools from "../stader-ui-lib/templates/LSPools/LSPools";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
// import WelcomeScreenPoolLiquidStaking from "../components/common/WelcomeScreenPoolLiquidStaking";

function Stake() {
  const { status } = useWallet();
  return (
    <div>
      {/*<MainLayout>
        {status === WalletStatus.WALLET_NOT_CONNECTED ? (
          <WelcomeScreenPoolLiquidStaking />
        ) : (
          <LSPools />
        )}
      </MainLayout>*/}

      <MainLayout>
        <LSPools />
      </MainLayout>
    </div>
  );
}

export default Stake;
