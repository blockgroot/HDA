import Loader from "@atoms/Loader/Loader";
import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";
import useAPY from "@hooks/useAPY";
import useExchangeRate from "@hooks/useExchangeRate";
import useHashConnect from "@hooks/useHashConnect";
import useAccount from "@hooks/useUserAccount";
import { Grid, useMediaQuery } from "@material-ui/core";
import InfoPageMobile from "components/common/InfoPageMobile";
import WelcomeScreenPoolLiquidStaking from "components/common/WelcomeScreenPoolLiquidStaking";
import LSPoolsEstimate from "../../molecules/LSPoolsEstimate/LSPoolsEstimate";
import LSPoolsEstimateWalletDisconnected from "../../molecules/LSPoolsEstimateWalletDisconnected/LSPoolsEstimateWalletDisconnected";
import LSPoolsForm from "../../organisms/LSPoolsForm/LSPoolsForm";
import { Box, Icon, Typography } from "../../atoms";
import { unBondingTime } from "@constants/constants";

function LSPools() {
  const {
    status,
    stake,
    unstake,
    withdraw,
    tvl,
    transactionStatus,
    transactionType,
    setTransActionStatus,
    withdrawStatus,
  } = useHashConnect();

  const { hbarX, hbar } = useAccount();
  const { exchangeRate, error } = useExchangeRate();
  const { apy } = useAPY();
  const tabletDown = useMediaQuery(`(max-width:${MQ_FOR_TABLET_LANDSCAPE}px)`);

  if (status === "INITIALIZING") {
    return <Loader text={"Please wait while we set things up for you"} />;
  }

  if (status !== "WALLET_CONNECTED") {
    return (
      <>
        <LSPoolsEstimateWalletDisconnected
          tvl={tvl}
          holdings={undefined}
          isLoading={false}
          apy={apy}
          exchangeRate={exchangeRate}
        />
        <InfoPageMobile />
      </>
    );
  }

  if (tabletDown) {
    return <InfoPageMobile />;
  }

  return (
    <div>
      <Grid
        container
        direction="column"
        spacing={3}
        {...(!tabletDown && { alignItems: "center" })}
      >
        <Grid item xs={8} md={8}>
          <LSPoolsEstimate
            tvl={tvl}
            holdings={hbarX}
            isLoading={false}
            apy={apy}
            exchangeRate={exchangeRate}
          />
        </Grid>
        <Grid item xs={8} md={8} className="flex-center">
          <LSPoolsForm
            tvlLoading={true}
            holding={hbar}
            handleStake={stake}
            handleUnstake={unstake}
            handleWithdraw={withdraw}
            transactionStatus={transactionStatus}
            transactionType={transactionType}
            setTransactionStatus={setTransActionStatus}
            exchangeRate={exchangeRate}
            withdrawStatus={withdrawStatus}
          />
        </Grid>
        <Grid item xs={8} md={8} className="flex-center">
          <Box
            noShadow
            className="w-full flex flex-row flex-center  justify-between align-middle  bg-[#060606]"
            style={{ minWidth: 666 }}
          >
            <Typography
              variant={"body2"}
              fontWeight={"semi-bold"}
              className="font-size-12 flex flex-row align-middle"
              style={{ textAlign: "center", margin: "auto" }}
            >
              <Icon
                name="warning_circle"
                width={20}
                height={20}
                className="mr-2"
              />{" "}
              HBARs will be available for withdrawal 7 days after unstaking
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default LSPools;
