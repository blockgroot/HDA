import {
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
} from "@constants/constants";
import { Box, Loader, Typography } from "../../atoms";
import styles from "./LSPoolsEstimate.module.scss";
import classNames from "classnames";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";

type Props = {
  tvl: any;
  holdings: number;
  isLoading: boolean;
  apy: number;
};

function LSPoolsEstimate(props: Props) {
  const { tvl, holdings, isLoading, apy } = props;

  if (isLoading) {
    return <Loader height={100} className={"mx-auto"} />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className="flex flex-row justify-between w-full align-middle pl-5 pr-10">
          <div className={styles.headerTitle}>
            <Typography variant={"body1"} fontWeight={"bold"}>
              My {LIQUID_NATIVE_TOKEN_LABEL}
            </Typography>
          </div>

          <div className={styles.headerTitle}>
            <div className={`${styles.headerWithInfo} flex items-center mb-3 mr-10`}>
              <Typography variant={"body1"} fontWeight={"bold"}>
                APY
              </Typography>
              <SDTooltip
                content={
                  "Average 48 hours APY including autocompounding of rewards."
                }
                className="text-white ml-1"
                fontSize="small"
              />
            </div>
          </div>
          <div className={styles.headerTitle}>
            <Typography variant={"body1"} fontWeight={"bold"}>
              TVL
            </Typography>
          </div>
        </div>

        <Box
          noPadding
          className="w-full flex flex-row justify-between align-middle p-3"
        >
          <div>
            <Typography
              variant={"h2"}
              fontWeight={"medium"}
              className={classNames("mt-3", styles.value)}
            >
              {(holdings / NATIVE_TOKEN_MULTIPLIER).toFixed(2)}
            </Typography>
          </div>

          <div>
            <Typography
              variant={"h2"}
              fontWeight={"medium"}
              className={classNames("mt-3", styles.value)}
            >
              {apy.toFixed(2)}%
            </Typography>
          </div>
          <div>
            <div className=" flex flex-row justify-between align-middle">
              <Typography
                variant={"h2"}
                fontWeight={"medium"}
                className={classNames("mr-2 mt-3 text-gradient", styles.value)}
              >
                {(tvl / NATIVE_TOKEN_MULTIPLIER).toFixed(2)}
              </Typography>
              <Typography
                variant={"body2"}
                color={"secondary"}
                className={classNames(
                  "mr-2 mt-6 justify-center text-center align-middle ",
                  styles.value
                )}
              >
                {NATIVE_TOKEN_LABEL}
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
