import useHashConnect from "@hooks/useHashConnect";
import useAccount from "@hooks/useUserAccount";
import { Grid, useMediaQuery } from "@material-ui/core";
import { ContractConfigType } from "@types_/liquid-staking-pool";
import Loader from "@atoms/Loader/Loader";
import WelcomeScreenPoolLiquidStaking from "components/common/WelcomeScreenPoolLiquidStaking";
import LSPoolsEstimate from "../../molecules/LSPoolsEstimate/LSPoolsEstimate";
import LSPoolsForm from "../../organisms/LSPoolsForm/LSPoolsForm";
import useExchangeRate from "@hooks/useExchangeRate";
import useAPY from "@hooks/useAPY";
import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";
import InfoPageMobile from "components/common/InfoPageMobile";

const defaultConfig: ContractConfigType = {
  min_deposit: 0,
  max_deposit: 10000,
  protocol_withdraw_fee: 0,
};

function LSPools() {
  const {
    walletData: saveData,
    network: network,
    installedExtensions,
    selectedAccount,
    status,
    stake,
    tvl,
    transactionStatus,
    setTransActionStatus,
  } = useHashConnect();

  const { hbarX, hbar } = useAccount();
  const { exchangeRate } = useExchangeRate();
  const { apy } = useAPY();
  const tabletDown = useMediaQuery(`(max-width:${MQ_FOR_TABLET_LANDSCAPE}px)`);

  if (tabletDown) {
    return <InfoPageMobile />;
  }

  console.log(apy, exchangeRate);

  if (status === "INITIALIZING") {
    return <Loader text={"Please wait while we set things up for you"} />;
  }

  if (status !== "WALLET_CONNECTED") {
    return <WelcomeScreenPoolLiquidStaking />;
  }

  return (
    <div>
      <Grid
        container
        direction="column"
        spacing={3}
        {...(!tabletDown && { alignItems: "center" })}
      >
        <Grid item xs={12} md={8}>
          <LSPoolsEstimate
            tvl={tvl}
            holdings={hbarX}
            isLoading={false}
            apy={apy}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <LSPoolsForm
            tvlLoading={true}
            contractConfig={defaultConfig}
            holding={hbar}
            handleStake={stake}
            transactionStatus={transactionStatus}
            setTransactionStatus={setTransActionStatus}
            exchangeRate={exchangeRate}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default LSPools;
