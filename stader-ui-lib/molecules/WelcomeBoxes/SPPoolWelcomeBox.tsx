import { Box, Typography } from "@atoms/index";
import React from "react";
import welcome_wave from "../../assets/svg/welcome_wave.svg";
import WalletSelector from "../WalletSelector/WalletSelector";
import styles from "./WelcomeBoxes.module.scss";

function SPPoolWelcomeBox() {
  return (
    <Box className={styles.sp_pool_container} noPadding>
      <img src={welcome_wave} alt="welcome" />
      <Typography variant="h2" className={styles.heading}>
        Hi there, welcome to the Stader community :)
      </Typography>
      <div className={styles.content_container}>
        <Typography variant="body1" fontWeight="bold">
          Stader offers the most convenient and safest way to maximise <br />
          your returns on staking.
        </Typography>
        <WalletSelector variant={"solid"} />
      </div>
    </Box>
  );
}

export default SPPoolWelcomeBox;
