import Loader from "@atoms/Loader/Loader";
import { NATIVE_TOKEN_LABEL, urls } from "@constants/constants";
import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";
import useAPY from "@hooks/useAPY";
import useExchangeRate from "@hooks/useExchangeRate";
import useHashConnect from "@hooks/useHashConnect";
import useAccount from "@hooks/useUserAccount";
import { Grid, useMediaQuery } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import InfoPageMobile from "components/common/InfoPageMobile";
import WelcomeScreenPoolLiquidStaking from "components/common/WelcomeScreenPoolLiquidStaking";
import LSPoolsEstimate from "../../molecules/LSPoolsEstimate/LSPoolsEstimate";
import LSPoolsForm from "../../organisms/LSPoolsForm/LSPoolsForm";
import { Box, Icon, Typography } from "../../atoms";

function LSPools() {
  const { status, stake, tvl, transactionStatus, setTransActionStatus } =
    useHashConnect();

  const { hbarX, hbar } = useAccount();
  const { exchangeRate, error } = useExchangeRate();
  const { apy } = useAPY();
  const tabletDown = useMediaQuery(`(max-width:${MQ_FOR_TABLET_LANDSCAPE}px)`);

  if (tabletDown) {
    return <InfoPageMobile />;
  }

  // console.log(apy, exchangeRate);

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
        <Grid item xs={8} md={8}>
          <LSPoolsEstimate
            tvl={tvl}
            holdings={hbarX}
            isLoading={false}
            apy={apy}
          />
        </Grid>
        <Grid item xs={8} md={8} className="flex-center">
          <LSPoolsForm
            tvlLoading={true}
            holding={hbar}
            handleStake={stake}
            transactionStatus={transactionStatus}
            setTransactionStatus={setTransActionStatus}
            exchangeRate={exchangeRate}
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
              Staked HBAR will be locked till the V2 product upgrade, expected
              around July 2022
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default LSPools;
