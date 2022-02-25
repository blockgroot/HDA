import { Box, Loader, Typography } from "../../atoms";
import styles from "./SPPoolTVL.module.scss";
import useTVLRewardsInfo from "../../../hooks/useTVLRewardsInfo";
import classNames from "classnames";

function SPPoolTVL() {
  const { tvlRewards, isLoading } = useTVLRewardsInfo();

  const renderElement = (
    <div className={styles.estimate}>
      <Typography
        variant={"h1"}
        fontWeight={"semi-bold"}
        className={classNames("text-gradient", styles.value)}
      >
        {tvlRewards.toLocaleString()}
      </Typography>
      <Typography color={"secondary"} variant={"body1"} className={styles.luna}>
        LUNA
      </Typography>
    </div>
  );
  return (
    <Box className={styles.box}>
      <div className={styles.container}>
        <Typography variant={"body1"} className={"text-light-800"}>
          Stake Pools TVL
        </Typography>
        {isLoading ? <Loader width={40} /> : renderElement}
      </div>
    </Box>
  );
}

export default SPPoolTVL;
