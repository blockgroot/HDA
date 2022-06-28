// import useLSPoolsForm from "../../../hooks/useLSPoolsForm";
import {
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS,
  NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
  precision,
  tokenLabel,
} from "@constants/constants";
import { config } from "config/config";
import { InputAdornment } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  nativeTokenFormatter,
  formatWIthLocale,
} from "../../../utils/CurrencyHelper";
import styles from "./LSPoolsFormLaToLx.module.scss";
import { getAnalytics, logEvent } from "firebase/analytics";
import LSPoolsForm from "./LSPoolsForm";
import useTransactionFee from "@hooks/useTransactionFee";

type Props = {
  tvlExchangeRate: number;
  walletBalance: number;
  handleStake: (amount: number) => void;
};

function LSPoolsFormStake({
  tvlExchangeRate,
  walletBalance,
  handleStake,
}: Props) {
  const minDeposit = config.minDeposit;
  const maxDeposit = config.maxDeposit;
  const { fee: transactionFee } = useTransactionFee();

  // const minDep = nativeTokenFormatter(minDeposit);
  // const maxDep = Math.min(nativeTokenFormatter(maxDeposit), walletBalance);
  // const stakingFee = nativeTokenFormatter(stakeTransactionFee);
  // const userBalance = nativeTokenFormatter(walletBalance);

  const calculateStakeValue = (value: number, setFieldValue: any) => {
    //check for - value
    // let val = (walletBalance * value) / NATIVE_TOKEN_MULTIPLIER;
    let val = (walletBalance - transactionFee) * value;
    val = Math.min(val, maxDeposit);
    val = Math.max(val, minDeposit);

    setFieldValue(
      "toToken",
      nativeTokenFormatter(val * tvlExchangeRate)
      // outputAmountLiquidNativeToken(val, tvlExchangeRate)
    );
    setFieldValue("fromToken", nativeTokenFormatter(val));
  };


  const validation = Yup.object().shape({
    fromToken: Yup.number()
      .test("wailet-no-money", "", function (value: number | undefined) {
        if (!value || value * 10 ** 8 + transactionFee <= walletBalance) {
          return true;
        } else {
          return this.createError({ message: "You do not have enough HBAR" });
        }
      })
      .lessThan(
        nativeTokenFormatter(walletBalance - transactionFee),
        `Entered amount should be less than ${nativeTokenFormatter(
          walletBalance - transactionFee
        )}`
      )
      .max(
        nativeTokenFormatter(maxDeposit),
        `Entered amount should be less than or equal to ${nativeTokenFormatter(
          maxDeposit
        )} ${NATIVE_TOKEN_LABEL}`
      )
      .min(
        nativeTokenFormatter(minDeposit),
        `Entered amount should be equal or more than ${nativeTokenFormatter(
          minDeposit
        )} ${NATIVE_TOKEN_LABEL}`
      )
      .required(
        `Entered amount should be more than ${nativeTokenFormatter(
          minDeposit
        )} ${NATIVE_TOKEN_LABEL}`
      ),

    // fees: Yup.number().moreThan(
    //   walletBalance-stakingFee-,
    //   `Not enough HBAR for transaction fees ${stakingFee}`
    // ),
  });

  return (
    <div className={styles.root}>
      <Formik
        initialValues={{
          fromToken: 0,
          toToken: 0,
          fees: transactionFee,
        }}
        onSubmit={(values) => {
          if (values.fromToken) {
            const analytics = getAnalytics();
            logEvent(analytics, "stake_click", { amount: values.fromToken });
            handleStake(values.fromToken);
          }
        }}
        validationSchema={validation}
      >
        {(formik) => {
          const { handleSubmit, getFieldProps, setFieldValue, errors } = formik;

          return (
            <LSPoolsForm
              maxIntegerPoinsts={NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS}
              maxDecimalPoints={NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS}
              availableLabel={`
        Available:
        ${(walletBalance / NATIVE_TOKEN_MULTIPLIER).toFixed(precision)} 
        ${NATIVE_TOKEN_LABEL} (ℏ)
        `}
              fromTokenProps={getFieldProps("fromToken")}
              fromTokenLabel={`Enter Amount min ${nativeTokenFormatter(
                minDeposit
              )} ℏ max ${formatWIthLocale(nativeTokenFormatter(maxDeposit))} ℏ`}
              tokenCostLabel={`1 ${tokenLabel} = ~ ${(
                1 / tvlExchangeRate
              ).toFixed(precision)} ${NATIVE_TOKEN_LABEL}`}
              transactionFeeLabel={`${nativeTokenFormatter(
                transactionFee
              )} ${NATIVE_TOKEN_LABEL} (ℏ)`}
              buttonLabel={"Stake"}
              fromTokenInputProps={{
                endAdornment: (
                  <InputAdornment position="end" className="text-white">
                    <span className={"text-white"}>ℏ {NATIVE_TOKEN_LABEL}</span>
                  </InputAdornment>
                ),
              }}
              toTokenInputProps={{
                endAdornment: (
                  <InputAdornment position="end" className="text-white">
                    <span className={"text-white"}>
                      {LIQUID_NATIVE_TOKEN_LABEL}
                    </span>
                  </InputAdornment>
                ),
              }}
              toTokenProps={getFieldProps("toToken")}
              walletBalance={walletBalance}
              errors={errors}
              onPercentageButtonsClick={(value) => {
                const analytics = getAnalytics();

                logEvent(analytics, "percentage_button_click", { value });
                calculateStakeValue(value, setFieldValue);
              }}
              onFromTokenChange={(e) => {
                let value = e.target.value;
                setFieldValue(
                  "toToken",

                  parseFloat(
                    (Number(value) * tvlExchangeRate).toFixed(precision)
                  )
                  // outputAmountLiquidNativeToken(value, tvlExchangeRate)
                );
                setFieldValue("fromToken", value);
              }}
              onToTokenChange={() => {
                return "";
              }}
              handleSubmit={handleSubmit}
            ></LSPoolsForm>
          );
        }}
      </Formik>
    </div>
  );
}

export default LSPoolsFormStake;
