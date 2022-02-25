import React from "react";
import styles from "./Heading.module.scss";

const Heading = () => {
  return (
    <div className={styles.coinListHeading}>
      <div>
        <img src="/static/stader_logo.svg" alt="Stader" width="50" />
      </div>
      <h1 className="gradientText">Stader Token Sale on CoinList</h1>
    </div>
  );
};

export default Heading;
