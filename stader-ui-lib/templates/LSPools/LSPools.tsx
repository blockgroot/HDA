import LSPoolsEstimate from "../../molecules/LSPoolsEstimate/LSPoolsEstimate";

import LSPoolsForm from "../../organisms/LSPoolsForm/LSPoolsForm";
import LPMyHolding from "../../molecules/LPMyHolding/LPMyHolding";

import LPPoolsWithdraw from "../../organisms/LPPoolsWithdraw/LPPoolsWithdraw";
import { Typography } from "../../atoms";
import Loader from "@atoms/Loader/Loader";

import { config } from "../../../config/config";
import { useState } from "react";
import { ContractConfigType } from "@types_/liquid-staking-pool";

import { Grid } from "@material-ui/core";
import useAccount from "@hooks/useUserAccount";
import useHashConnect from "@hooks/useHashConnect";
import WelcomeScreenPoolLiquidStaking from "components/common/WelcomeScreenPoolLiquidStaking";

const defaultConfig: ContractConfigType = {
  min_deposit: 0,
  max_deposit: 0,
  protocol_withdraw_fee: 0,
};

function LSPools() {
  const {
    connect,
    associateToken,
    accountInfo,
    walletData: saveData,
    network: network,
    installedExtensions,
    status,
    stake,
    tvl,
  } = useHashConnect();

  const { hbarX, isAsocciated, hbar, accountId } = useAccount();

  // const holdingQuery = useUserHolding();

  // const [config, setConfig] = useState<ContractConfigType>(defaultConfig);

  // const handleInitialization = async () => {
  //   try {
  //     const contractConfig = await terra.wasm.contractQuery(contractAddress, {
  //       config: {},
  //     });

  //     const min_deposit = Number(contractConfig?.config?.min_deposit ?? 0);
  //     const max_deposit = Number(contractConfig?.config?.max_deposit ?? 0);
  //     const protocol_withdraw_fee = Number(
  //       contractConfig?.config?.protocol_withdraw_fee ?? 0
  //     );

  //     return { min_deposit, max_deposit, protocol_withdraw_fee };
  //   } catch (e) {
  //     return { success: false, message: "Error!" + e };
  //   }
  // };

  // const contractConfigQuery = useQuery(
  //   LS_CONTRACT_CONFIG,
  //   handleInitialization,
  //   {
  //     onSuccess: (res: ContractConfigType) => {
  //       setConfig(res);
  //     },
  //     refetchOnWindowFocus: false,
  //   }
  // );

  // if (
  //   contractConfigQuery.isLoading ||
  //   tvlLoading ||
  //   holdingQuery.isLoading ||
  //   wallet.status === WalletStatus.INITIALIZING
  // ) {
  //   return <Loader text={"Please wait while we set things up for you"} />;

  // }

  if (status !== "WALLET_CONNECTED") {
    return <WelcomeScreenPoolLiquidStaking />;
  }

  return (
    <div>
      <Grid container direction="column" spacing={3} alignItems="center">
        <Grid item xs={12} md={8}>
          <LSPoolsEstimate tvl={tvl} holdings={hbarX} isLoading={false} />
        </Grid>
        <Grid item xs={12} md={8}>
          <LSPoolsForm
            tvl={tvl}
            tvlLoading={false}
            contractConfig={defaultConfig}
            holding={hbar}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default LSPools;
