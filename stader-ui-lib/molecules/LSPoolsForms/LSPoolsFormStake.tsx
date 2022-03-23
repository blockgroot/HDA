// import useLSPoolsForm from "../../../hooks/useLSPoolsForm";
import { ButtonOutlined } from "@atoms/Button/Button";
import {
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS,
  NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
  precision,
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
  minimumDeposit: number;
  maximumDeposit: number;
  ustWalletBalance: number;
  handleStake: (amount: number) => void;
};

function LSPoolsFormStake(props: Props) {
  const {
    tvlExchangeRate,
    walletBalance,
    minimumDeposit,
    maximumDeposit,
    ustWalletBalance,
    handleStake,
  } = props;
  // console.log(tvlExchangeRate);

  const minDep = nativeTokenFormatter(minimumDeposit);
  const maxDep = Math.min(nativeTokenFormatter(maximumDeposit), walletBalance);

  // console.log(minDep, maxDep);

  const validation = Yup.object().shape({
    nativeToken: Yup.number()
      .max(
        maximumDeposit,
        `Deposit amount should be less than ${maximumDeposit} ${NATIVE_TOKEN_LABEL}`
      )
      .min(
        minimumDeposit,
        `Deposit amount should be more than ${minimumDeposit} ${NATIVE_TOKEN_LABEL}`
      )
      .required(
        `Deposit amount should be more than ${maximumDeposit} ${NATIVE_TOKEN_LABEL}`
      ),
    // ust: Yup.number().moreThan(0.0, "Not enough ust for transaction fees"),
  });

  return (
    <div className={styles.root}>
      <Formik
        initialValues={{
          nativeToken: 0,
          liquidNativeToken: 0,
          ust: ustWalletBalance,
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
                    let val = walletBalance * value;
                    setFieldValue(
                      "liquidNativeToken",
                      (Number(val) * tvlExchangeRate).toFixed(precision)
                      // outputAmountLiquidNativeToken(val, tvlExchangeRate)
                    );
                    setFieldValue("nativeToken", val.toFixed(precision));
                  }}
                />
                <Typography variant={"body3"} color={"textSecondary"}>
                  Transaction Fee: Approx 1 {NATIVE_TOKEN_LABEL}
                </Typography>
              </div>
              {(errors.ust || errors.nativeToken) && (
                <Typography
                  variant={"body2"}
                  color={"textSecondary"}
                  fontWeight={"medium"}
                  className={"block mt-3 text-center"}
                >
                  {errors.ust || errors.nativeToken}
                </Typography>
              )}
              <div className="mt-6 lg:mt-12 flex justify-center">
                <ButtonOutlined
                  className="w-[200px] h-[48px]"
                  disabled={!!Object.keys(errors).length || !values.nativeToken}
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
