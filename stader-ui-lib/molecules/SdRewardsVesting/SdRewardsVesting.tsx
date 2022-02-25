import React from "react";
import styles from "./SdRewardsVesting.module.scss";
import VestingDateUpdate from "./VestingDateUpdate";
import VestingMainText from "./VestingMainText";
import VestingNote from "./VestingNote";
import VestingSubText from "./VestingSubText";

interface ISdRewardsVestingProps {
  isLiquidStaking?: boolean;
}

const SdRewardsVesting: React.FC<ISdRewardsVestingProps> = ({
  isLiquidStaking,
}) => {
  return (
    <div className={styles.sdRewardsVestingContainer}>
      <h2>SD Rewards Vesting</h2>
      <div className={styles.sdRewardsVestingContent}>
        <div className={"mb-8"}>
          <VestingMainText />
        </div>
        <VestingSubText isLiquidStaking={isLiquidStaking} />
        <VestingDateUpdate isLiquidStaking={isLiquidStaking} />
        <VestingNote />
      </div>
    </div>
  );
};

export default SdRewardsVesting;
