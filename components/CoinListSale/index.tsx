import React from "react";
import About from "./About/About";
import styles from "./CoinListSale.module.scss";
import Heading from "./Heading/Heading";
import RegistrationClosed from "./RegistrationClosed/RegistrationClosed";

const CoinListSale: React.FC = () => {
  return (
    <div className={styles.coinListSaleContainer}>
      <Heading />
      <div className={styles.coinListSaleContent}>
        <div>
          <About />
          <RegistrationClosed />
        </div>
      </div>
    </div>
  );
};

export default CoinListSale;
