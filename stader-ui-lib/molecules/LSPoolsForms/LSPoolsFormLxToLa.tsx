import {

  NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS,
  NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS,
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
  tokenLabel,
  urls,
  ustFee
} from "@constants/constants";
import { Formik } from "formik";
import { Divider, Loader, SuccessAnimation, Typography } from "../../atoms";
import PercentageButtons from "../PercentageButtons/PercentageButtons";
import useLSPoolsForm from "@hooks/useLSPoolsForm";
import { ButtonOutlined } from "@atoms/Button/Button";
import styles from "./LSPoolsFormLaToLx.module.scss";
import * as Yup from "yup";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import { InputAdornment } from "@material-ui/core";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";

interface Props {
  tvlExchangeRate: number;
  ustWalletBalance: number;
  maximumDeposit: number;
  minimumDeposit: number;
  holding: number;
}

function LSPoolsFormLxToLa(props: Props) {
  const {
    tvlExchangeRate = 0,
    holding,
    ustWalletBalance,
    minimumDeposit,
  } = props;

  const { outputAmountLiquidNativeTokenToNativeToken, handleUnstake, unStakingMutation } =
    useLSPoolsForm();

  const availableAmount = (holding / NATIVE_TOKEN_MULTIPLIER).toFixed(6);
  const minDep = nativeTokenFormatter(minimumDeposit);

  const validation = Yup.object().shape({
    liquidNativeToken: Yup.number()
      .max(
        Number(availableAmount),
        `Unstake amount should be less than ${availableAmount} ${NATIVE_TOKEN_LABEL}`
      )
      .min(minDep, `Unstake amount should be more than ${minDep} ${NATIVE_TOKEN_LABEL}`)
      .required(`Unstake amount should be more than ${minDep} ${NATIVE_TOKEN_LABEL}`),
    ust: Yup.number().moreThan(ustFee, "Not enough ust for transaction fees"),
  });

  if (unStakingMutation.isLoading) return <Loader position={"center"} />;
  if (unStakingMutation.data?.success) {
    return (
      <div className="flex flex-col flex-center">
        <div className="mb-4">
          <SuccessAnimation width={"100px"} height={"100px"} />
        </div>

        <Typography variant={"body2"} fontWeight={"semi-bold"}>
          {unStakingMutation.data?.message}
        </Typography>

        <div className="mt-4">
          <ButtonOutlined onClick={unStakingMutation.reset} size={"large"}>
            Done
          </ButtonOutlined>
        </div>
      </div>
    );
  }
  return (
    <Formik
      initialValues={{
        nativeToken: 0,
        liquidNativeToken: 0,
        ust: ustWalletBalance,
      }}
      onSubmit={(values) => {
        if (values.liquidNativeToken) {
          handleUnstake(values.liquidNativeToken);
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
                Available: {availableAmount} {LIQUID_NATIVE_TOKEN_LABEL}
              </Typography>

              <Typography
                variant={"body3"}
              >{`1 ${tokenLabel} = ${tvlExchangeRate.toFixed(
                6
              )} ${NATIVE_TOKEN_LABEL}`}</Typography>
            </div>
            {errors.liquidNativeToken && (
              <Typography
                variant={"caption1"}
                color={"textSecondary"}
                fontWeight={"medium"}
                className={"block mt-3 text-center"}
              >
                {errors.liquidNativeToken}
              </Typography>
            )}
            <div className={"mt-4 mb-8 relative"}>
              <NumberInput
                {...liquidNativeTokenProps}
                maxIntegerPoinsts={NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS}
                maxDecimalPoints={NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS}
                label="Enter Amount"
                onChange={(e) => {
                  let value = e.target.value;
                  setFieldValue(
                    "nativeToken",
                    outputAmountLiquidNativeTokenToNativeToken(value, tvlExchangeRate)
                  );
                  setFieldValue("liquidNativeToken", value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className="text-white">
                      <span className={"text-white"}>{LIQUID_NATIVE_TOKEN_LABEL}</span>
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
                {...nativeTokenProps}
                maxIntegerPoinsts={NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS}
                maxDecimalPoints={NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS}
                label="Output Amount"
                value={nativeTokenProps.value}
                onChange={() => {
                  return "";
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className={"text-white"}>{NATIVE_TOKEN_LABEL}</span>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </div>
            <div className={styles.percentage_buttons_container}>
              <PercentageButtons
                total={availableAmount}
                activeValue={liquidNativeTokenProps.value}
                onClick={(value) => {
                  let val = Number(availableAmount) * value;
                  setFieldValue(
                    "nativeToken",
                    outputAmountLiquidNativeTokenToNativeToken(val, tvlExchangeRate)
                  );
                  formik.setFieldValue("liquidNativeToken", val.toFixed(6));
                }}
              />
              <Typography variant={"body3"} color={"textSecondary"}>
                Transaction Fee: {ustFee} UST
              </Typography>
            </div>
            <Divider color={"gradient"} />
            <div>
              <div className={styles.liquidNativeToken_to_nativeToken_info}>
                <Typography
                  variant={"body3"}
                  fontWeight={"medium"}
                  color={"secondary"}
                  component="li"
                >
                  Unstaking takes 21-24 days to unlock {NATIVE_TOKEN_LABEL}. Unlock {NATIVE_TOKEN_LABEL}
                  instantly{" "}
                  <a
                    href={urls.terraSwapSwap}
                    target={"_blank"}
                    className={"font-bold"}
                    rel="noreferrer"
                  >
                    here
                  </a>
                </Typography>
                <Typography
                  variant={"body3"}
                  fontWeight={"medium"}
                  color={"secondary"}
                  component="li"
                >
                  Only 50% of the unvested Community Farming SD Rewards will
                  vest if you withdraw your LP position before August 9, 2022
                </Typography>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <ButtonOutlined size={"large"} disabled={!Boolean(values.liquidNativeToken)}>
                Unstake
              </ButtonOutlined>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}

export default LSPoolsFormLxToLa;
