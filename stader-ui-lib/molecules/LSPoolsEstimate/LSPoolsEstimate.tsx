import {
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
  precision,
} from "@constants/constants";
import { Box, Loader, Typography } from "../../atoms";
import styles from "./LSPoolsEstimate.module.scss";
import classNames from "classnames";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";
import { useMediaQuery } from "@material-ui/core";
import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";

type Props = {
  tvl: any;
  holdings: number;
  isLoading: boolean;
  apy: number;
  exchangeRate: number;
};

function LSPoolsEstimate(props: Props) {
  const { tvl, holdings, isLoading, apy, exchangeRate } = props;
  const tabletDown = useMediaQuery(`(max-width:${MQ_FOR_TABLET_LANDSCAPE}px)`);
  if (isLoading) {
    return <Loader height={100} className={"mx-auto"} />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Box noPadding className="w-full  justify-between align-middle">
          <div
            className={`flex ${
              tabletDown ? "flex-column" : "flex-row"
            }  justify-between w-full align-middle p-2`}
          >
            <div className="flex-center flex-col">
              <div
                className={`${styles.headerTitle}  flex-coll flex-center p-4`}
              >
                <Typography variant={"body1"} fontWeight={"bold"}>
                  My {LIQUID_NATIVE_TOKEN_LABEL.toUpperCase()}
                </Typography>
                <SDTooltip
                  content={"Total HBARX in your connected wallet"}
                  className="text-white ml-1"
                  fontSize="small"
                />
              </div>
              <Typography
                variant={"h2"}
                fontWeight={"medium"}
                className={classNames("", styles.value)}
              >
                {(holdings / NATIVE_TOKEN_MULTIPLIER).toFixed(precision)}
              </Typography>
            </div>

            <div className="flex-center flex-col">
              <div
                className={`${styles.headerTitle} flex  flex-center items-center flex-coll align-middle p-4`}
              >
                <Typography variant={"body1"} fontWeight={"bold"}>
                  TVL
                </Typography>
                <SDTooltip
                  content={"Total HBAR in the Stake Pool"}
                  className="text-white ml-1"
                  fontSize="small"
                />
              </div>
              <div className=" flex flex-row  align-middle">
                <Typography
                  variant={"h2"}
                  fontWeight={"medium"}
                  className={classNames("mr-2  text-gradient", styles.value)}
                >
                  {parseFloat(
                    (tvl / NATIVE_TOKEN_MULTIPLIER).toFixed(precision)
                  ).toLocaleString(undefined, {
                    maximumFractionDigits: precision,
                  })}
                </Typography>
                <Typography
                  variant={"body2"}
                  color={"secondary"}
                  className={classNames(
                    "justify-center text-center align-middle ",
                    styles.value
                  )}
                >
                  {NATIVE_TOKEN_LABEL}
                </Typography>
              </div>
            </div>
            <div className=" flex-center flex-col mr-2">
              <div
                className={`${styles.headerWithInfo} flex flex-row  flex-center align-middle p-4`}
              >
                <Typography variant={"body1"} fontWeight={"bold"}>
                  APY
                </Typography>
                <SDTooltip
                  content={
                    "Estimated annualized return based on current Emission Rate and TVL"
                  }
                  className="text-white ml-1"
                  fontSize="small"
                />
              </div>
              <Typography
                variant={"h2"}
                fontWeight={"medium"}
                className={classNames("", styles.value)}
              >
                {apy && apy.toFixed(precision)}%
              </Typography>
            </div>
          </div>
          <div className="text-white align-middle text-center bg-black rounded-b-3xl p-2 border-t-2 border border-dark-200 flex flex-row justify-center">
            Your total HBARX value is &nbsp;~{" "}
            <Typography
              variant={"body1"}
              fontWeight={"medium"}
              color={"secondary"}
              className={classNames("", styles.value)}
            >
              {parseFloat(
                (
                  ((1 / exchangeRate) * holdings) /
                  NATIVE_TOKEN_MULTIPLIER
                ).toFixed(precision)
              ).toLocaleString(undefined, {
                maximumFractionDigits: precision,
              })}{" "}
              HBAR
            </Typography>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default LSPoolsEstimate;

// {
//   isLoading ? <Loader height={100} className={"mx-auto"} /> : renderElement;
// }
