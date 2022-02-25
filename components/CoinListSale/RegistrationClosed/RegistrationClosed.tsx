import React from "react";
import DocumentIcon from "../../../assets/svg/document_icon.svg";
import styles from "./RegistrationClosed.module.scss";
const RegistrationClosed = () => {
  return (
    <div className={styles.coinListRegistrationClosed}>
      <h4>2.  Priority Queue Registration Update</h4>
      <div>
        <img src={DocumentIcon} alt="Registration closed" />
        <h5>Registration for Stader CoinList Priority Queue is Closed Now!</h5>
        <p>Registered users will receive an email from Stader.</p>

        <span>
          Please note that the Final Priority Queue access is determined by
          CoinList based on their KYC and internal audit/review process. Stader
          will only submit the list of CoinList registered email IDs that are
          eligible based on our selection criteria. Final Priority Queue
          participants will get an email from CoinList with a Priority Queue
          18–12 hours before commencement of sale.
        </span>
      </div>
    </div>
  );
};

export default RegistrationClosed;
