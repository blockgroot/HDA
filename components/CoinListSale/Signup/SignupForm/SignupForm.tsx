import { TextInput } from "@terra-dev/neumorphism-ui/components/TextInput";
import c from "classnames";
import React from "react";
import useSignupFormState, { SaleOption } from "../helpers/useSignupFormState";
import styles from "../Signup.module.scss";
import { MoreInfoAboutSaleOptions } from "./MoreInfoAboutSaleOptions";
import { RegisterForSaleText } from "./RegisterForSaleText";
import { SignupNote } from "./SignupNote";

const saleOptions: SaleOption[] = [
  { value: "Option1", label: "Option 1 (Price: $4.50)" },
  { value: "Option2", label: "Option 2 (Price: $3.33)" },
];

interface ISignupFormProps {
  onSuccess: () => void;
}
const SignupForm: React.FC<ISignupFormProps> = (props) => {
  const { state, signupForSale, updateState } = useSignupFormState(
    props.onSuccess
  );
  const { email, error, saleOption, signingUp } = state;

  return (
    <div className={styles.coinListSignupForm}>
      <ol>
        <RegisterForSaleText />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signupForSale();
          }}
        >
          <li>
            Submit the same Email-ID with which you have registered for the
            Stader CoinList Sale
            <TextInput
              type="email"
              placeholder="name@abc.com"
              style={{ display: "flex", margin: "1em 0" }}
              onChange={(event) => {
                updateState({ error: "", email: event.target.value.trim() });
              }}
              value={email}
              fullWidth
              helperText="Please enter your email-id"
            />
          </li>
          <li>
            Mention the Sale option you would like to be considered for the
            Priority Queue (You can only choose one option)
            <div className="mt-2">
              {saleOptions.map((option) => (
                <div key={option.value} style={{ display: "inline-block" }}>
                  <input
                    type="radio"
                    name="option1"
                    id={`coinListSaleOption-${option.value}`}
                    checked={saleOption === option.value}
                    onChange={() => {
                      updateState({ error: "", saleOption: option.value });
                    }}
                  />
                  <label
                    htmlFor={`coinListSaleOption-${option.value}`}
                    style={{ marginRight: "1em" }}
                    className={c({
                      [styles.active]: saleOption === option.value,
                    })}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
              <MoreInfoAboutSaleOptions />
              <p className={styles.errorMsg}>{error}</p>
              <button type="submit" disabled={signingUp || !email}>
                Submit
              </button>
            </div>
          </li>
        </form>
      </ol>
      <SignupNote />
    </div>
  );
};

export default SignupForm;
