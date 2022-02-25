import React from "react";
import MainLayout from "../layout";
import SPStrategies from "../stader-ui-lib/templates/SPStrategies/SPStrategies";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import StrategiesZeroState from "../components/common/StrategiesZeroState";

function Dashboard() {
  const { status } = useWallet();
  return (
    <div>
      <MainLayout>
        {status === WalletStatus.WALLET_NOT_CONNECTED ? (
          <StrategiesZeroState />
        ) : (
          <SPStrategies />
        )}
      </MainLayout>
    </div>
  );
}

export default Dashboard;
