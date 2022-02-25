import LSPoolsEstimate from "../../molecules/LSPoolsEstimate/LSPoolsEstimate";
import useLSPoolsEstimate from "../../../hooks/useLSPoolsEstimate";
import LSPoolsForm from "../../organisms/LSPoolsForm/LSPoolsForm";
import LPMyHolding from "../../molecules/LPMyHolding/LPMyHolding";
import useLPBatchHoldingLunaX from "../../../hooks/useLPBatchHoldingLunaX";
import LPPoolsWithdraw from "../../organisms/LPPoolsWithdraw/LPPoolsWithdraw";
import { Typography } from "../../atoms";
import Loader from "@atoms/Loader/Loader";
import { useQuery } from "react-query";
import { LS_CONTRACT_CONFIG } from "@constants/queriesKey";
import { config } from "../../../config/config";
import { useAppContext } from "@libs/appContext";
import { useState } from "react";
import { ContractConfigType } from "@types_/liquid-staking-pool";
import useUserHolding from "@hooks/useUserHolding";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { Grid } from "@material-ui/core";

const { liquidStaking: contractAddress } = config.contractAddresses;

const defaultConfig: ContractConfigType = {
  min_deposit: 0,
  max_deposit: 0,
  protocol_withdraw_fee: 0,
};

function LSPools() {
  const { terra } = useAppContext();
  const wallet = useWallet();
  const { tvl, tvlLoading } = useLSPoolsEstimate();
  const { data, isLoading, undelegationQuery } = useLPBatchHoldingLunaX();

  const holdingQuery = useUserHolding();

  const [config, setConfig] = useState<ContractConfigType>(defaultConfig);

  const handleInitialization = async () => {
    try {
      const contractConfig = await terra.wasm.contractQuery(contractAddress, {
        config: {},
      });

      const min_deposit = Number(contractConfig?.config?.min_deposit ?? 0);
      const max_deposit = Number(contractConfig?.config?.max_deposit ?? 0);
      const protocol_withdraw_fee = Number(
        contractConfig?.config?.protocol_withdraw_fee ?? 0
      );

      return { min_deposit, max_deposit, protocol_withdraw_fee };
    } catch (e) {
      return { success: false, message: "Error!" + e };
    }
  };

  const contractConfigQuery = useQuery(
    LS_CONTRACT_CONFIG,
    handleInitialization,
    {
      onSuccess: (res: ContractConfigType) => {
        setConfig(res);
      },
      refetchOnWindowFocus: false,
    }
  );

  if (
    contractConfigQuery.isLoading ||
    tvlLoading ||
    holdingQuery.isLoading ||
    wallet.status === WalletStatus.INITIALIZING
  ) {
    return <Loader text={"Please wait while we set things up for you"} />;
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <LSPoolsEstimate
            tvl={tvl}
            holdings={holdingQuery.holding}
            isLoading={holdingQuery.isLoading || tvlLoading}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <LSPoolsForm
            tvl={tvl}
            tvlLoading={tvlLoading}
            contractConfig={config}
            holding={holdingQuery.holding}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} className={"mt-12 mb-16"}>
        <Grid item xs={12} md={4}>
          <LPMyHolding
            isLoading={isLoading}
            lunaTokens={data?.lunaToken || 0}
            lunaXTokens={data?.lunaXToken || 0}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography
            variant={"h3"}
            fontWeight={"bold"}
            className={"mb-4 md:mb-14"}
          >
            Withdrawals
          </Typography>
          <LPPoolsWithdraw
            isLoading={undelegationQuery.isLoading}
            undelegations={undelegationQuery.data}
            refetchQuery={undelegationQuery.refetch}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default LSPools;
