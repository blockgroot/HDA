import React from "react";
// import LiquidStakingRewards from "../components/pageComponents/LiquidStakingRewards";
import MainLayout from "../layout";
import LSRewards from "../stader-ui-lib/templates/LSRewards/LSRewards";

function Rewards() {
  return (
    <div>
      <MainLayout>
        {/*<LiquidStakingRewards />*/}
        <LSRewards />
      </MainLayout>
    </div>
  );
}

export default Rewards;
