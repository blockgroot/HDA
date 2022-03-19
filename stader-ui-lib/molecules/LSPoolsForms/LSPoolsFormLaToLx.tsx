import {
  NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS,
  NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS,
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_LABEL,
  tokenLabel,
  ustFeeStaking,
} from "@constants/constants";
import { Formik } from "formik";
import { Divider, Loader, Typography } from "../../atoms";
import PercentageButtons from "../PercentageButtons/PercentageButtons";
// import useLSPoolsForm from "../../../hooks/useLSPoolsForm";
import { ButtonOutlined } from "@atoms/Button/Button";
import styles from "./LSPoolsFormLaToLx.module.scss";
import DepositSuccess from "../DepositSuccess/DepositSuccess";
import * as Yup from "yup";
import { nativeTokenFormatter } from "../../../utils/CurrencyHelper";
import { InputAdornment } from "@material-ui/core";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";

type Props = {
  tvlExchangeRate: number;
  walletBalance: number;
  minimumDeposit: number;
  maximumDeposit: number;
  ustWalletBalance: number;
};

function LSPoolsFormLaToLx(props: Props) {
  const {
    tvlExchangeRate = 0,
    walletBalance,
    minimumDeposit,
    maximumDeposit,
    ustWalletBalance,
  } = props;

  // const {
  //   handleStake,
  //   outputAmountLiquidNativeToken,
  //   isLoading,
  //   resetQuery,
  //   data,
  // } = useLSPoolsForm();

  // if (isLoading) return <Loader position={"center"} />;
  // if (data?.success) {
  //   return <DepositSuccess reset={resetQuery} message={data?.message} />;
  // }
  const minDep = nativeTokenFormatter(minimumDeposit);
  const maxDep = Math.min(nativeTokenFormatter(maximumDeposit), walletBalance);

  const validation = Yup.object().shape({
    nativeToken: Yup.number()
      .max(
        maxDep,
        `Deposit amount should be less than ${maxDep} ${NATIVE_TOKEN_LABEL}`
      )
      .min(
        minDep,
        `Deposit amount should be more than ${minDep} ${NATIVE_TOKEN_LABEL}`
      )
      .required(
        `Deposit amount should be more than ${minDep} ${NATIVE_TOKEN_LABEL}`
      ),
    ust: Yup.number().moreThan(0.9, "Not enough ust for transaction fees"),
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
            // handleStake(values.nativeToken);
          }
        }}
        validationSchema={validation}
      >
        {(formik) => {
          const { handleSubmit, getFieldProps, setFieldValue, values, errors } =
            formik;
          const nativeTokenProps = getFieldProps("nativeToken");
          const liquidNativeTokenProps = getFieldProps("liquidNativeToken");

          return (
            <form onSubmit={handleSubmit}>
              <div className={styles.available_amount_validation}>
                <Typography variant={"body3"} color={"secondary"}>
                  Available: {walletBalance.toFixed(6)} {NATIVE_TOKEN_LABEL}
                </Typography>

                <Typography
                  variant={"body3"}
                >{`1 ${tokenLabel} = ${tvlExchangeRate.toFixed(
                  6
                )} ${NATIVE_TOKEN_LABEL}`}</Typography>
              </div>
              {(errors.ust || errors.nativeToken) && (
                <Typography
                  variant={"caption1"}
                  color={"textSecondary"}
                  fontWeight={"medium"}
                  className={"block mt-3 text-center"}
                >
                  {errors.ust || errors.nativeToken}
                </Typography>
              )}
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
                      value
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
                      val
                      // outputAmountLiquidNativeToken(val, tvlExchangeRate)
                    );
                    setFieldValue("nativeToken", val.toFixed(6));
                  }}
                />
                <Typography variant={"body3"} color={"textSecondary"}>
                  Transaction Fee: {ustFeeStaking} UST
                </Typography>
              </div>
              <div className="mt-6 lg:mt-12 flex justify-center">
                <ButtonOutlined
                  className="w-[200px] h-[48px]"
                  disabled={!!Object.keys(errors).length || !values.nativeToken}
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

export default LSPoolsFormLaToLx;
