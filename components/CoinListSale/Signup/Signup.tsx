import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import React, { useEffect, useState } from "react";
import useSignupContract from "./helpers/useSignupContract";
import styles from "./Signup.module.scss";
import SignupConnectWallet from "./SignupConnectWallet";
import SignupDone from "./SignupDone";
import SignupForm from "./SignupForm/SignupForm";
import SignupLoading from "./SignupLoading";
import SignupSuccess from "./SignupSuccess";

type SignupState =
  | "Loading"
  | "AlreadySignedUp"
  | "SignupSuccess"
  | "SignupRequired"
  | "EditSignupDetails";

const Signup = () => {
  const wallet = useWallet();
  return (
    <div className={styles.coinListSignup}>
      <h4>3. Sign up for CoinList Sale Priority Queue</h4>
      <div>
        {(() => {
          if (wallet.status === WalletStatus.INITIALIZING) {
            return <SignupLoading />;
          } else if (wallet.status === WalletStatus.WALLET_NOT_CONNECTED) {
            return <SignupConnectWallet />;
          }
          return <SignupWithWallet />;
        })()}
      </div>
    </div>
  );
};

export default Signup;

function SignupWithWallet() {
  const [signupState, setSignupState] = useState<SignupState>("Loading");

  const { checkIfAlreadySignedUp } = useSignupContract();

  useEffect(() => {
    checkIfAlreadySignedUp()
      .then((r) => {
        setSignupState(r ? "AlreadySignedUp" : "SignupRequired");
      })
      .catch((e) => {
        console.log("Error while encrypting and signing up with contract.", e);
        setSignupState("SignupRequired");
      });
  }, []);

  switch (signupState) {
    case "Loading":
      return <SignupLoading />;
    case "AlreadySignedUp":
      return (
        <SignupDone onEditRequest={() => setSignupState("EditSignupDetails")} />
      );
    case "SignupSuccess":
      return (
        <SignupSuccess
          onEditRequest={() => setSignupState("EditSignupDetails")}
        />
      );
    default:
      return <SignupForm onSuccess={() => setSignupState("SignupSuccess")} />;
  }
}
