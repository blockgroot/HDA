import {
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
  precision,
  tokenLabel,
} from "@constants/constants";
import { Box, Loader, Typography } from "../../atoms";
import styles from "./LSPoolsEstimateWalletDisconnected.module.scss";
import classNames from "classnames";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";
import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";
import { useMediaQuery } from "@material-ui/core";

type Props = {
  tvl: any;
  holdings?: number;
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
        <Box noPadding className="w-full  justify-between align-middle p-3">
          {/* <div className="flex flex-row justify-between w-full align-middle  ">
            <div
              className={`${styles.headerTitle} flex flex-row items-center flex-coll flex-center align-middle `}
            ></div>
          </div> */}

        <div className={`flex ${ tabletDown ? 'flex-column' :'flex-row  justify-between w-full align-middle'} `}>
            <div className={` ${ tabletDown ? '' : 'flex-center '} flex-col mt-4`}>
              <div
                className={`${styles.headerTitle}  flex-coll   ${ tabletDown ? '' : ' flex-center p-4'}`}
              >
                <Typography variant={"body1"} fontWeight={"bold"}>
                  Exchange Rate
                </Typography>
                <SDTooltip
                  content={
                    "Actual exchange rate may vary from the displayed value"
                  }
                  className="text-white ml-1"
                  fontSize="small"
                />
              </div>
              <Typography
                variant={"h3"}
                fontWeight={"medium"}
                className={classNames( tabletDown ? '' : 'p-4', styles.value)}
              >{`1 ${tokenLabel} = ~ ${(1 / exchangeRate).toFixed(
                precision
              )} ${NATIVE_TOKEN_LABEL}`}</Typography>
            </div>

            <div className={` ${ tabletDown ? '' : 'flex-center '} flex-col mr-2`}>
              <div
                className={`${styles.headerTitle} flex   flex-coll  ${ tabletDown ? '' : ' flex-center items-center align-middle p-4'}`}
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
                  variant={"h1"}
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
            <div className={`${ tabletDown ? '' : 'flex-center '} flex-col`}>
              <div
                className={`${styles.headerWithInfo} flex flex-row   align-middle ${ tabletDown ? '' : ' flex-center p-4'}`}
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
                className={classNames("pr-4", styles.value)}
              >
                {apy && apy.toFixed(precision)}%
              </Typography>
            </div>
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
