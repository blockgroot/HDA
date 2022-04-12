// import useLSPoolsForm from "../../../hooks/useLSPoolsForm";
import { ButtonOutlined } from "@atoms/Button/Button";
import {
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS,
  NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
  precision,
  stakeTransactionFee,
  tokenLabel,
} from "@constants/constants";
import { config } from "config/config";
import { InputAdornment } from "@material-ui/core";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  nativeTokenFormatter,
  formatWIthLocale,
} from "../../../utils/CurrencyHelper";
import { Typography } from "../../atoms";
import PercentageButtons from "../PercentageButtons/PercentageButtons";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";
import styles from "./LSPoolsFormLaToLx.module.scss";
import { getAnalytics, logEvent } from "firebase/analytics";

type Props = {
  tvlExchangeRate: number;
  walletBalance: number;
  handleStake: (amount: number) => void;
};

function LSPoolsFormStake(props: Props) {
  const { tvlExchangeRate, walletBalance, handleStake } = props;
  const minDeposit = config.minDeposit;
  const maxDeposit = config.maxDeposit;

  // console.log(tvlExchangeRate);

  // const minDep = nativeTokenFormatter(minDeposit);
  // const maxDep = Math.min(nativeTokenFormatter(maxDeposit), walletBalance);
  // const stakingFee = nativeTokenFormatter(stakeTransactionFee);
  // const userBalance = nativeTokenFormatter(walletBalance);

  const calculateStakeValue = (value: number, setFieldValue: any) => {
    //check for - value
    // let val = (walletBalance * value) / NATIVE_TOKEN_MULTIPLIER;
    let val = (walletBalance - stakeTransactionFee) * value;
    val = Math.min(val, maxDeposit);
    val = Math.max(val, minDeposit);

    setFieldValue(
      "liquidNativeToken",
      nativeTokenFormatter(val * tvlExchangeRate)
      // outputAmountLiquidNativeToken(val, tvlExchangeRate)
    );
    setFieldValue("nativeToken", nativeTokenFormatter(val));
  };

  // console.log(minDep, maxDep, stakingFee);

  const validation = Yup.object().shape({
    nativeToken: Yup.number()
      .test("wailet-no-money", "", function (value: number | undefined) {
        if (
          !value ||
          value + stakeTransactionFee + minDeposit < walletBalance
        ) {
          return true;
        } else {
          return this.createError({ message: "You do not have enough HBARs" });
        }
      })
      .lessThan(
        nativeTokenFormatter(walletBalance - stakeTransactionFee),
        `Entered amount should be less than ${nativeTokenFormatter(
          walletBalance - stakeTransactionFee
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
          nativeToken: 0,
          liquidNativeToken: 0,
          fees: stakeTransactionFee,
        }}
        onSubmit={(values) => {
          if (values.nativeToken) {
            const analytics = getAnalytics();
            logEvent(analytics, "stake_click", { amount: values.nativeToken });
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
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <div className={styles.available_amount_validation}>
                <div className="flex flex-row align-middle">
                  <Typography variant={"body3"} color={"secondary"}>
                    Available:{" "}
                    {(walletBalance / NATIVE_TOKEN_MULTIPLIER).toFixed(
                      precision
                    )}{" "}
                    {NATIVE_TOKEN_LABEL} (ℏ)
                  </Typography>
                </div>
                <div className="flex flex-row align-middle">
                  <Typography variant={"body3"}>{`1 ${tokenLabel} = ~ ${(
                    1 / tvlExchangeRate
                  ).toFixed(precision)} ${NATIVE_TOKEN_LABEL}`}</Typography>
                  <SDTooltip
                    content={
                      "Actual exchange rate may vary from the displayed value"
                    }
                    className="text-white ml-1"
                    fontSize="small"
                  />
                </div>
              </div>

              <div className={"mt-4 mb-8 relative"}>
                <NumberInput
                  {...nativeTokenProps}
                  maxIntegerPoinsts={NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS}
                  maxDecimalPoints={NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS}
                  label={`Enter Amount min ${nativeTokenFormatter(
                    minDeposit
                  )} ℏ max ${formatWIthLocale(
                    nativeTokenFormatter(maxDeposit)
                  )} ℏ`}
                  onChange={(e) => {
                    let value = e.target.value;
                    setFieldValue(
                      "liquidNativeToken",

                      parseFloat(
                        (Number(value) * tvlExchangeRate).toFixed(precision)
                      )
                      // outputAmountLiquidNativeToken(value, tvlExchangeRate)
                    );
                    setFieldValue("nativeToken", value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" className="text-white">
                        <span className={"text-white"}>
                          ℏ {NATIVE_TOKEN_LABEL}
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
                    const analytics = getAnalytics();

                    logEvent(analytics, "percentage_button_click", { value });
                    calculateStakeValue(value, setFieldValue);
                  }}
                />
                <Typography variant={"body3"} color={"textSecondary"}>
                  Transaction Fee: ~ {nativeTokenFormatter(stakeTransactionFee)}{" "}
                  {NATIVE_TOKEN_LABEL} (ℏ)
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
              <div className="mt-8 lg:mt-8 flex justify-center">
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
