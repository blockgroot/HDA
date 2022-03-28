// import useLSPoolsForm from "../../../hooks/useLSPoolsForm";
import { ButtonOutlined } from "@atoms/Button/Button";
import {
  LIQUID_NATIVE_TOKEN_LABEL,
  maxDeposit,
  minDeposit,
  NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS,
  NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
  precision,
  stakeTransactionFee,
  tokenLabel,
} from "@constants/constants";
import { InputAdornment } from "@material-ui/core";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import { Formik } from "formik";
import * as Yup from "yup";
import { nativeTokenFormatter } from "../../../utils/CurrencyHelper";
import { Typography } from "../../atoms";
import PercentageButtons from "../PercentageButtons/PercentageButtons";
import styles from "./LSPoolsFormLaToLx.module.scss";

type Props = {
  tvlExchangeRate: number;
  walletBalance: number;
  handleStake: (amount: number) => void;
};

function LSPoolsFormStake(props: Props) {
  const { tvlExchangeRate, walletBalance, handleStake } = props;

  // console.log(tvlExchangeRate);

  const minDep = nativeTokenFormatter(minDeposit);
  const maxDep = Math.min(nativeTokenFormatter(maxDeposit), walletBalance);
  const stakingFee = nativeTokenFormatter(stakeTransactionFee);
  const userBalance = nativeTokenFormatter(walletBalance);

  // console.log(minDep, maxDep, stakingFee);

  const validation = Yup.object().shape({
    nativeToken: Yup.number()
      .lessThan(
        userBalance - stakingFee,
        `Deposit amount should be less than ${userBalance - stakingFee}`
      )
      .max(
        maxDep,
        `Deposit amount should be less than or equal to ${maxDep} ${NATIVE_TOKEN_LABEL}`
      )
      .min(
        minDep,
        `Deposit amount should be equal or more than ${minDep} ${NATIVE_TOKEN_LABEL}`
      )
      .required(
        `Deposit amount should be more than ${minDep} ${NATIVE_TOKEN_LABEL}`
      ),

    // fees: Yup.number().moreThan(
    //   walletBalance-stakingFee-,
    //   `Not enough Hbar for transaction fees ${stakingFee}`
    // ),
  });

  return (
    <div className={styles.root}>
      <Formik
        initialValues={{
          nativeToken: 0,
          liquidNativeToken: 0,
          fees: stakingFee,
        }}
        onSubmit={(values) => {
          if (values.nativeToken) {
            handleStake(values.nativeToken);
          }
        }}
        validationSchema={validation}
      >
        {(formik) => {
          const {
            handleSubmit,
            getFieldProps,
            setFieldValue,
            values,
            errors,
            isSubmitting,
          } = formik;
          const nativeTokenProps = getFieldProps("nativeToken");
          const liquidNativeTokenProps = getFieldProps("liquidNativeToken");

          return (
            <form onSubmit={handleSubmit}>
              <div className={styles.available_amount_validation}>
                <Typography variant={"body3"} color={"secondary"}>
                  Available:{" "}
                  {(walletBalance / NATIVE_TOKEN_MULTIPLIER).toFixed(precision)}{" "}
                  {NATIVE_TOKEN_LABEL}
                </Typography>

                <Typography variant={"body3"}>{`1 ${tokenLabel} = ${(
                  1 / tvlExchangeRate
                ).toFixed(precision)} ${NATIVE_TOKEN_LABEL}`}</Typography>
              </div>

              <div className={"mt-4 mb-8 relative"}>
                <NumberInput
                  {...nativeTokenProps}
                  maxIntegerPoinsts={NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS}
                  maxDecimalPoints={NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS}
                  label="Enter Amount"
                  onChange={(e) => {
                    let value = e.target.value;
                    setFieldValue(
                      "liquidNativeToken",
                      (Number(value) * tvlExchangeRate).toFixed(precision)
                      // outputAmountLiquidNativeToken(value, tvlExchangeRate)
                    );
                    setFieldValue("nativeToken", value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" className="text-white">
                        <span className={"text-white"}>
                          {NATIVE_TOKEN_LABEL}
                        </span>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                <span className={styles.arrow_down}>
                  <img src="/static/arrowDown.png" alt="Arrow down" />
                </span>
              </div>
              <div className={"mb-6"}>
                <NumberInput
                  {...liquidNativeTokenProps}
                  maxIntegerPoinsts={NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS}
                  maxDecimalPoints={NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS}
                  label="Output Amount"
                  value={liquidNativeTokenProps.value}
                  onChange={() => {
                    return "";
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" className="text-white">
                        <span className={"text-white"}>
                          {LIQUID_NATIVE_TOKEN_LABEL}
                        </span>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              </div>
              <div className={styles.percentage_buttons_container}>
                <PercentageButtons
                  total={walletBalance}
                  activeValue={nativeTokenProps.value}
                  onClick={(value) => {
                    //check for - value
                    let val = (walletBalance * value) / NATIVE_TOKEN_MULTIPLIER;
                    setFieldValue(
                      "liquidNativeToken",
                      (Number(val) * tvlExchangeRate).toFixed(precision)
                      // outputAmountLiquidNativeToken(val, tvlExchangeRate)
                    );
                    setFieldValue("nativeToken", val.toFixed(precision));
                  }}
                />
                <Typography variant={"body3"} color={"textSecondary"}>
                  Transaction Fee: Approx {stakingFee} {NATIVE_TOKEN_LABEL}
                </Typography>
              </div>
              {(errors.fees || errors.nativeToken) && (
                <Typography
                  variant={"body2"}
                  color={"primary"}
                  fontWeight={"medium"}
                  className={"block mt-8 text-center"}
                >
                  {errors.fees || errors.nativeToken}
                </Typography>
              )}
              <div className="mt-4 lg:mt-8 flex justify-center">
                <ButtonOutlined
                  className="w-[200px] h-[48px]"
                  disabled={
                    !!Object.keys(errors).length || nativeTokenProps.value === 0
                  }
                  type="submit"
                >
                  Stake
                </ButtonOutlined>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}

export default LSPoolsFormStake;
