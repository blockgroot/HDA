import {
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS,
  NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
  precision,
  tokenLabel,
} from "@constants/constants";
import useExchangeRate from "@hooks/useExchangeRate";
import useAccount from "@hooks/useUserAccount";
import { InputAdornment } from "@material-ui/core";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Formik } from "formik";
import * as Yup from "yup";
import { Icon, Typography } from "../../atoms";
import LSPoolsForm from "./LSPoolsForm";
import styles from "./LSPoolsFormLaToLx.module.scss";
import useTransactionFee from "@hooks/useTransactionFee";
import { useState } from "react";
import { Hbar } from "@hashgraph/sdk";
interface Props {
  tvlExchangeRate: number;
  walletBalance: number;
  handleUnstake: (amount: number) => void;
  readyState: boolean;
}

function LSPoolsFormUnstake(props: Props) {
  const { tvlExchangeRate, handleUnstake, walletBalance } = props;
  const { hbarX, hbar } = useAccount();
  const [percentValue, setPercentValue] = useState(0);

  const { fee: transactionFee } = useTransactionFee();
  const maxDeposit = hbarX;
  const minDeposit = 0;
  const validation = Yup.object().shape({
    fromToken: Yup.number()
      .required(` ${NATIVE_TOKEN_LABEL} Amount is required`)
      .moreThan(
        minDeposit,
        `Minimum unstake amount should be more than ${minDeposit}`
      )
      .lessThan(
        (maxDeposit + 1) / NATIVE_TOKEN_MULTIPLIER,
        `Not enough HBARX `
      ),

    fees: Yup.number().lessThan(
      walletBalance,
      `Not enough HBAR for transaction fees ${transactionFee}`
    ),
  });
  const calculateUnStakeValue = (value: number, setFieldValue: any) => {
    //check for - value
    // let val = (walletBalance * value) / NATIVE_TOKEN_MULTIPLIER;

    let val = hbarX * value;
    val = Math.min(val, maxDeposit);
    val = Math.max(val, minDeposit);
    setFieldValue(
      "toToken",
      nativeTokenFormatter((val * 1) / tvlExchangeRate)
      // outputAmountLiquidNativeToken(val, tvlExchangeRate)
    );
    setFieldValue("fromToken", nativeTokenFormatter(val));
  };

  return !props.readyState ? (
    <div className={styles.root}>
      <div
        className=" flex flex-center flex-column height-full"
        style={{ height: "80%" }}
      >
        <div className="speed_container">
          <Icon name="speed" width={20} height={20} className="" />
          <Icon name="speed_circle" width={60} height={60} className="" />
        </div>

        <div className="comming-soon_container">
          <Typography variant={"body1"} fontWeight={"normal"}>
            Unstake/ withdrawal functionality will be available with V2 product
            upgrade, expected around July
          </Typography>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.root}>
      <Formik
        initialValues={{
          fromToken: 0,
          toToken: 0,
          fees: transactionFee,
        }}
        onSubmit={async (values) => {
          if (values.fromToken) {
            const analytics = getAnalytics();
            if (percentValue > 0) {
              const unstakeAmount = parseInt((hbarX * percentValue).toString());

              logEvent(analytics, "unstake_click", {
                amount: unstakeAmount,
              });
              handleUnstake(unstakeAmount);
            } else {
              const tinyBarValue = new Hbar(values.fromToken)
                .toTinybars()
                .toNumber();
              logEvent(analytics, "unstake_click", {
                amount: tinyBarValue,
              });
              handleUnstake(tinyBarValue);
            }
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
        ${nativeTokenFormatter(hbarX)} 
        ${LIQUID_NATIVE_TOKEN_LABEL} 
        `}
              fromTokenProps={getFieldProps("fromToken")}
              fromTokenLabel={`Enter Amount `}
              tokenCostLabel={`1 ${tokenLabel} = ~ ${(
                1 / tvlExchangeRate
              ).toFixed(precision)} ${NATIVE_TOKEN_LABEL}`}
              transactionFeeLabel={`${nativeTokenFormatter(
                transactionFee
              )} ${NATIVE_TOKEN_LABEL} (ℏ)`}
              buttonLabel={"Unstake"}
              fromTokenInputProps={{
                endAdornment: (
                  <InputAdornment position="end" className="text-white">
                    <span className={"text-white"}>
                      {LIQUID_NATIVE_TOKEN_LABEL}
                    </span>
                  </InputAdornment>
                ),
              }}
              toTokenInputProps={{
                endAdornment: (
                  <InputAdornment position="end" className="text-white">
                    <span className={"text-white"}>ℏ {NATIVE_TOKEN_LABEL}</span>
                  </InputAdornment>
                ),
              }}
              toTokenProps={getFieldProps("toToken")}
              walletBalance={hbarX}
              errors={errors}
              onPercentageButtonsClick={(value) => {
                const analytics = getAnalytics();
                logEvent(analytics, "percentage_button_click", { value });
                setPercentValue(value);
                calculateUnStakeValue(value, setFieldValue);
              }}
              onFromTokenChange={(e) => {
                let value = e.target.value;
                setFieldValue(
                  "toToken",

                  parseFloat(
                    ((Number(value) * 1) / tvlExchangeRate).toFixed(precision)
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

export default LSPoolsFormUnstake;
