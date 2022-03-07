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
import WelcomeScreenPoolLiquidStaking from "components/common/WelcomeScreenPoolLiquidStaking";
import useAccount from "@hooks/useAccount";

import useHashConnect from "@hooks/useHashConnect";

const { liquidStaking: contractAddress } = config.contractAddresses;

const defaultConfig: ContractConfigType = {
  min_deposit: 0,
  max_deposit: 1000000,
  protocol_withdraw_fee: 0,
};

function LSPools() {
  // const { terra } = useAppContext();
  // const {
  //   connect,
  //   walletData,
  //   installedExtensions,
  //   associateToken,
  //   accountInfo,
  // } = useHashConnect();

  // const { accountIds, network, id } = walletData;

  // const { tvl, tvlLoading } = useLSPoolsEstimate();
  // const { data, isLoading, undelegationQuery } = useLPBatchHoldingLunaX();

  // const holdingQuery = useUserHolding();

  const [config, setConfig] = useState<ContractConfigType>(defaultConfig);
  const {
    connect,
    walletData,
    installedExtensions,
    associateToken,
    accountInfo,
    status,
    stake,
    tvl,
  } = useHashConnect();

  const { hbarX, isAsocciated, hbar } = useAccount();

  // const { accountIds, network, id } = walletData;
  const handleAssocuiteToken = () => {
    console.log("associateToken2");
    associateToken();
  };

  const handleStake = (amount: number) => {
    console.log("stake2");
    stake(amount);
  };

  if (status !== WalletStatus.WALLET_CONNECTED) {
    return <WelcomeScreenPoolLiquidStaking />;
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <LSPoolsEstimate
            tvl={tvl}
            holdings={hbarX}
            isLoading={false}
            token={"hbar"}
            tokenX={"hbarx"}
            apy={9.86}
            isAssocciated={isAsocciated}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <LSPoolsForm
            tvl={tvl}
            tvlLoading={false}
            contractConfig={config}
            holding={accountInfo?.balance.toBigNumber().toNumber() || 0}
            isAssocciated={isAsocciated}
            associateToken={handleAssocuiteToken}
            handleStake={handleStake}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} className={"mt-12 mb-16"}>
        {/* <Grid item xs={12} md={4}>
          <LPMyHolding
            isLoading={isLoading}
            lunaTokens={data?.lunaToken || 0}
            lunaXTokens={data?.lunaXToken || 0}
          />
        </Grid> */}
        <Grid item xs={8} md={8}>
          {/* <Typography
            variant={"h3"}
            fontWeight={"bold"}
            className={"mb-4 md:mb-14"}
          >
            Withdrawals (Coming soon)
          </Typography> */}
          {/* <LPPoolsWithdraw
            isLoading={undelegationQuery.isLoading}
            undelegations={undelegationQuery.data}
            refetchQuery={undelegationQuery.refetch}
          /> */}
        </Grid>
      </Grid>
    </div>
  );
}

export default LSPools;
