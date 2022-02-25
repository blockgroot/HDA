import React from "react";
import styles from "./About.module.scss";

const About = () => {
  return (
    <div className={styles.coinListAbout}>
      <h4>1. CoinList Sale</h4>
      <div>
        Stader is thrilled to announce that on January 25th, we will become the
        first protocol on Terra to do a token sale on CoinList. We are providing
        priority queue access during the sale for Stader stakers and early
        community members. Check eligibility & Signup to be a part of it.
      </div>
    </div>
  );
};

export default About;
