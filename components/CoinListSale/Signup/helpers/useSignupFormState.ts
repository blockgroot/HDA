import { useState } from "react";
import encryptEmailApi from "./encryptEmailApi";
import useSignupContract from "./useSignupContract";

export type SaleOptionType = "Option1" | "Option2";
export type SaleOption = { value: SaleOptionType; label: string };

interface ISignupFormState {
  email: string;
  saleOption: SaleOption["value"];
  error: string;
  signingUp: boolean;
}

const useSignupFormState = (onSignupSuccess: () => void) => {
  const { signup } = useSignupContract();

  const [state, setState] = useState<ISignupFormState>({
    email: "",
    saleOption: "Option1",
    error: "",
    signingUp: false,
  });
  const { email, saleOption } = state;

  const updateState = (update: Partial<ISignupFormState>) => {
    setState((prevState) => ({ ...prevState, ...update }));
  };

  const signupForSale = async () => {
    const trimmedEmail = email.trim();
    // check if email is valid
    // > Should have @
    // > atleast 3 characters
    // > no empty spaces between characters ex: "ab c@def.com"
    if (
      !trimmedEmail.includes("@") ||
      trimmedEmail.length < 3 ||
      trimmedEmail.split(" ").length > 1
    ) {
      updateState({ error: "Please enter a valid email address" });
      return;
    }

    updateState({ signingUp: true, error: "" });

    // encrypt email and sign up through the contract
    encryptEmailApi(trimmedEmail)
      .then((encryptedEmail) => signup(encryptedEmail, saleOption))
      .then((r) => {
        if (r.right) {
          onSignupSuccess();
        } else {
          updateState({ error: r.left.errorMsg, signingUp: false });
        }
      })
      .catch((e) => {
        console.log(e);
        updateState({
          error:
            e.message ||
            "Something went wrong while signing up. Please try again later.",
          signingUp: false,
        });
      });
  };

  return {
    state,
    updateState,
    signupForSale,
  };
};

export default useSignupFormState;
