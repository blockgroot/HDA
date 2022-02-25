import React from "react";
import styles from "./Eligibility.module.scss";
import router from "next/router";
import GradientBtnWithArrow from "../../common/GradientLinkWithArrow";
import COINLIST_SALE_CONSTANTS from "../constants";
import OutlinedButton from "../../common/OutlinedButton";

const Eligibility = () => {
  return (
    <div className={styles.coinListEligibility}>
      <h4>2. Am I eligible for the CoinList Priority Queue?</h4>
      <div>
        <ul>
          <li>
            To check if you are eligible refer to the criteria mentioned here
            <GradientBtnWithArrow
              onClick={() =>
                window.open(
                  COINLIST_SALE_CONSTANTS.eligibilityCriteriaLink,
                  "_blank"
                )
              }
            >
              Eligibility Criteria
            </GradientBtnWithArrow>
          </li>
          <li>
            If you don’t meet the eligibility criteria, 10% of priority queue
            slots are still available for users who stake before{" "}
            {COINLIST_SALE_CONSTANTS.registrationEndTime}.(Minimum 10 Luna in
            either stake pools or liquid staking)
            <p style={{ color: "#00DBFF" }}>
              The higher you stake, the better your chances to get in!
            </p>
          </li>
        </ul>
        <OutlinedButton onClick={() => router.push("/lt-pools")}>
          Stake now
        </OutlinedButton>
      </div>
    </div>
  );
};

export default Eligibility;
