import Box from "@atoms/Box/Box";
import Typography from "@atoms/Typography/Typography";
import styles from "./LiquidNativeTokenRedirectionInfo.module.scss";
import {
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_LABEL,
} from "@constants/constants";

export const LiquidNativeTokenRedirectionInfo = () => {
  return (
    <Box noPadding={true} className="p-5 flex-1">
      <div>
        <Typography fontWeight="bold" variant="body2" className="mb-3">
          Don't want to lose unvested SD tokens?
        </Typography>
        <ul className={styles.list}>
          <li>
            Click on the{" "}
            <span className={styles.bold_text}>
              Get {LIQUID_NATIVE_TOKEN_LABEL}
            </span>{" "}
            button to convert all your {NATIVE_TOKEN_LABEL} to{" "}
            {LIQUID_NATIVE_TOKEN_LABEL}
          </li>
          <li>
            Hold {LIQUID_NATIVE_TOKEN_LABEL} until vesting schedule is done
          </li>
        </ul>
      </div>
      <div className="mt-3">
        <Typography fontWeight="bold" variant="body2" className="mb-3">
          Even better, want to earn more SD tokens? Here's what you can do:
        </Typography>
        <ul className={styles.list}>
          <li>
            Convert half of withdrawn {NATIVE_TOKEN_LABEL} to{" "}
            {LIQUID_NATIVE_TOKEN_LABEL}{" "}
            <a
              style={{ color: "#00DBFF" }}
              href="https://app.terraswap.io/swap?to=&type=provide&from=uluna"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </li>
          <li>
            Provide {LIQUID_NATIVE_TOKEN_LABEL} {"<>"} {NATIVE_TOKEN_LABEL}{" "}
            liquidity on Terraswap immediately so you don't miss out on the
            random weekly snapshot
          </li>
        </ul>
      </div>
    </Box>
  );
};
