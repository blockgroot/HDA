import {
  ADD_LIQUIDITY_APR,
  LT_SD_TOKENS_FARMED_PER_DAY,
  urls,
} from "../../../constants/constants";
import { Box, Divider, Loader, Typography } from "../../atoms";
import styles from "./LPMyHolding.module.scss";
import { Tooltip } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";

interface Props {
  lunaTokens: number;
  lunaXTokens: number;
  isLoading: boolean;
}

export default function LPMyHolding({
  lunaTokens,
  lunaXTokens,
  isLoading,
}: Props) {
  return (
    <div className={"md:h-full"}>
      <Typography variant={"h3"} fontWeight={"bold"}>
        Liquidity Pool
      </Typography>
      <div className="mb-6 mt-2">
        <Typography
          variant={"caption2"}
          fontWeight={"bold"}
          className="gradientText"
        >
          Deposit to LP pool to earn SD rewards
        </Typography>
      </div>
      <Box className={"px-8 py-6 h-full"}>
        {isLoading ? (
          <Loader position={"center"} />
        ) : (
          <>
            <div className="flex mb-5">
              <img
                src={"/static/lunax.png"}
                alt={"lunax"}
                width={40}
                className={"mr-4"}
              />
              <img src={"/static/luna.png"} alt={"luna"} width={40} />
            </div>
            <Typography variant={"body1"} fontWeight={"bold"}>
              My LP Holdings
            </Typography>
            <Typography variant={"body1"} className={"mt-5"}>
              {lunaXTokens.toFixed(6)} LunaX - {lunaTokens.toFixed(6)} LUNA
            </Typography>
            <div className="flex items-center mt-6">
              <Typography variant={"body1"}>APR</Typography>
              <Typography
                variant={"h1"}
                fontWeight={"bold"}
                className={"ml-4 mr-1"}
              >
                {ADD_LIQUIDITY_APR}%
              </Typography>
              <SDTooltip
                content={
                  "Average 48 hrs swap fees + Coinlist sale price of SD tokens"
                }
                className="text-white ml-1"
                fontSize="small"
              />
            </div>
            <div className={"my-4"}>
              <Divider color={"light"} />
            </div>

            <div className="flex items-center">
              <Typography variant={"h2"} className={"mb-1"}>
                {LT_SD_TOKENS_FARMED_PER_DAY}
              </Typography>
              <Typography variant={"body2"} className={"ml-1"}>
                {" "}
                SD / day rewards
              </Typography>
            </div>
            <a
              href={urls.terraSwapProvide}
              target="_blank"
              rel="noreferrer"
              className={styles.swap_btn}
            >
              <span>{"Add Liquidity"}</span>
            </a>
            <a
              href={urls.terraSwapSwap}
              target="_blank"
              rel="noreferrer"
              className={styles.swap_btn}
            >
              <span>{"Swap"}</span>
            </a>
          </>
        )}
      </Box>
    </div>
  );
}
