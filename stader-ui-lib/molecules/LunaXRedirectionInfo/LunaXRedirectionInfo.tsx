import Box from "@atoms/Box/Box";
import Typography from "@atoms/Typography/Typography";
import styles from "./LunaXRedirectionInfo.module.scss";

export const LunaXRedirectionInfo = () => {
  return (
    <Box noPadding={true} className="p-5 flex-1">
      <div>
        <Typography fontWeight="bold" variant="body2" className="mb-3">Don't want to lose unvested SD tokens?</Typography>
        <ul className={styles.list}>
          <li>
            Click on the <span className={styles.bold_text}>'Get LunaX'</span>{" "}
            button to convert all your Luna to LunaX
          </li>
          <li>Hold LunaX until vesting schedule is done</li>
        </ul>
      </div>
      <div className="mt-3">
        <Typography fontWeight="bold" variant="body2" className="mb-3">
          Even better, want to earn more SD tokens? Here's what you can do:
        </Typography>
        <ul className={styles.list}>
          <li>
            Convert half of withdrawn Luna to LunaX{" "}
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
            Provide {"LunaX <> Luna"} liquidity on Terraswap immediately so you
            don't miss out on the random weekly snapshot
          </li>
        </ul>
      </div>
    </Box>
  );
};
