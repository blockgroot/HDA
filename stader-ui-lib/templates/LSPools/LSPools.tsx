import useHashConnect from "@hooks/useHashConnect";
import useAccount from "@hooks/useUserAccount";
import { Grid } from "@material-ui/core";
import { ContractConfigType } from "@types_/liquid-staking-pool";
import Loader from "@atoms/Loader/Loader";
import WelcomeScreenPoolLiquidStaking from "components/common/WelcomeScreenPoolLiquidStaking";
import LSPoolsEstimate from "../../molecules/LSPoolsEstimate/LSPoolsEstimate";
import LSPoolsForm from "../../organisms/LSPoolsForm/LSPoolsForm";

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
    status,
    stake,
    tvl,
    transactionStatus,
    setTransActionStatus,
  } = useHashConnect();

  const { hbarX, hbar, accountId } = useAccount();

  // console.log("hbar", hbar);
  // console.log("stake", stake);

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

  // if (status === "INITIALIZING") {
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
            tvlLoading={true}
            contractConfig={defaultConfig}
            holding={hbar}
            handleStake={stake}
            transactionStatus={transactionStatus}
            setTransactionStatus={setTransActionStatus}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default LSPools;
