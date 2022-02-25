import { tokenLabel, ustFeeStaking } from "@constants/constants";
import { Formik } from "formik";
import { Divider, Loader, Typography } from "../../atoms";
import PercentageButtons from "../PercentageButtons/PercentageButtons";
import useLSPoolsForm from "../../../hooks/useLSPoolsForm";
import { ButtonOutlined } from "@atoms/Button/Button";
import styles from "./LSPoolsFormLaToLx.module.scss";
import DepositSuccess from "../DepositSuccess/DepositSuccess";
import * as Yup from "yup";
import { lunaFormatter } from "@utils/CurrencyHelper";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import {
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from "@anchor-protocol/notation";
import { InputAdornment } from "@material-ui/core";

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

  const { handleStake, outputAmountLunax, isLoading, resetQuery, data } =
    useLSPoolsForm();

  if (isLoading) return <Loader position={"center"} />;
  if (data?.success) {
    return <DepositSuccess reset={resetQuery} message={data?.message} />;
  }
  const minDep = lunaFormatter(minimumDeposit);
  const maxDep = Math.min(lunaFormatter(maximumDeposit), walletBalance);

  const validation = Yup.object().shape({
    luna: Yup.number()
      .max(maxDep, `Deposit amount should be less than ${maxDep} LUNA`)
      .min(minDep, `Deposit amount should be more than ${minDep} LUNA`)
      .required(`Deposit amount should be more than ${minDep} LUNA`),
    ust: Yup.number().moreThan(0.9, "Not enough ust for transaction fees"),
  });

  return (
    <Formik
      initialValues={{
        luna: 0,
        lunax: 0,
        ust: ustWalletBalance,
      }}
      onSubmit={(values) => {
        if (values.luna) {
          handleStake(values.luna);
        }
      }}
      validationSchema={validation}
    >
      {(formik) => {
        const { handleSubmit, getFieldProps, setFieldValue, values, errors } =
          formik;
        const lunaProps = getFieldProps("luna");
        const lunaxProps = getFieldProps("lunax");

        return (
          <form onSubmit={handleSubmit}>
            <div className={styles.available_amount_validation}>
              <Typography variant={"body3"} color={"secondary"}>
                Available: {walletBalance.toFixed(6)} LUNA
              </Typography>

              <Typography
                variant={"body3"}
              >{`1 ${tokenLabel} = ${tvlExchangeRate.toFixed(
                6
              )} LUNA`}</Typography>
            </div>
            {(errors.ust || errors.luna) && (
              <Typography
                variant={"caption1"}
                color={"textSecondary"}
                fontWeight={"medium"}
                className={"block mt-3 text-center"}
              >
                {errors.ust || errors.luna}
              </Typography>
            )}
            <div className={"mt-4 mb-8 relative"}>
              <NumberInput
                {...lunaProps}
                maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
                maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
                label="Enter Amount"
                onChange={(e) => {
                  let value = e.target.value;
                  setFieldValue(
                    "lunax",
                    outputAmountLunax(value, tvlExchangeRate)
                  );
                  setFieldValue("luna", value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className="text-white">
                      <span className={"text-white"}>LUNA</span>
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
                {...lunaxProps}
                maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
                maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
                label="Output Amount"
                value={lunaxProps.value}
                onChange={() => {
                  return "";
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className="text-white">
                      <span className={"text-white"}>LunaX</span>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </div>
            <div className={styles.percentage_buttons_container}>
              <PercentageButtons
                total={walletBalance}
                activeValue={lunaProps.value}
                onClick={(value) => {
                  let val = walletBalance * value;
                  setFieldValue(
                    "lunax",
                    outputAmountLunax(val, tvlExchangeRate)
                  );
                  setFieldValue("luna", val.toFixed(6));
                }}
              />
              <Typography variant={"body3"} color={"textSecondary"}>
                Transaction Fee: {ustFeeStaking} UST
              </Typography>
            </div>
            <Divider color={"gradient"} />
            <div className="mt-6 lg:mt-12 flex justify-center">
              <ButtonOutlined
                size={"large"}
                disabled={!!Object.keys(errors).length || !values.luna}
              >
                Stake
              </ButtonOutlined>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}

export default LSPoolsFormLaToLx;
