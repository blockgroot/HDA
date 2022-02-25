import { InfoOutlined } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";
import { LUNA_MULTIPLIER } from "@constants/constants";
import { Box, Loader, Typography } from "../../atoms";
import { demicrofy, formatUST } from "@anchor-protocol/notation";
import styles from "./LSPoolsEstimate.module.scss";
import classNames from "classnames";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";

type Props = {
  tvl: any;
  holdings: number;
  isLoading: boolean;
};

function LSPoolsEstimate(props: Props) {
  const { tvl, holdings, isLoading } = props;

  const renderElement = (
    <>
      <div className="lg:mb-8">
        <Typography variant={"body1"} fontWeight={"bold"}>
          My LunaX
        </Typography>
        <Typography
          variant={"h2"}
          fontWeight={"medium"}
          className={classNames("mt-3", styles.value)}
        >
          {(holdings / LUNA_MULTIPLIER).toFixed(6)}
        </Typography>
      </div>

      <div className="lg:mb-8">
        <div className={"flex items-center mb-3"}>
          <Typography variant={"body1"} fontWeight={"bold"}>
            APY
          </Typography>
          <SDTooltip
            content={
              "Average 48 hours APY including airdrops & autocompounding of rewards."
            }
            className="text-white ml-1"
            fontSize="small"
          />
        </div>
        <Typography
          variant={"h2"}
          fontWeight={"medium"}
          className={styles.value}
        >
          9.86%
        </Typography>
      </div>
      <div>
        <Typography variant={"body1"} fontWeight={"bold"}>
          TVL
        </Typography>
        <div className={"flex items-center mt-3"}>
          <Typography
            variant={"h2"}
            fontWeight={"medium"}
            className={classNames("mr-2 text-gradient", styles.value)}
          >
            {formatUST(demicrofy(tvl.uluna)).split(".")[0]}
          </Typography>
          <Typography
            variant={"body2"}
            color={"secondary"}
            className={styles.luna}
          >
            LUNA
          </Typography>
        </div>
      </div>
    </>
  );
  return (
    <Box className={styles.root} noPadding>
      {isLoading ? (
        <Loader height={100} className={"mx-auto"} />
      ) : (
        renderElement
      )}
    </Box>
  );
}

export default LSPoolsEstimate;
