import {
  LUNA_MULTIPLIER,
  tokenLabel,
  urls,
  ustFee,
} from "@constants/constants";
import { Formik } from "formik";
import { Divider, Loader, SuccessAnimation, Typography } from "../../atoms";
import PercentageButtons from "../PercentageButtons/PercentageButtons";
import useLSPoolsForm from "@hooks/useLSPoolsForm";
import { ButtonOutlined } from "@atoms/Button/Button";
import styles from "./LSPoolsFormLaToLx.module.scss";
import * as Yup from "yup";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import {
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from "@anchor-protocol/notation";
import { InputAdornment } from "@material-ui/core";
import { lunaFormatter } from "@utils/CurrencyHelper";

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

  const { outputAmountLunaxToLuna, handleUnstake, unStakingMutation } =
    useLSPoolsForm();

  const availableAmount = (holding / LUNA_MULTIPLIER).toFixed(6);
  const minDep = lunaFormatter(minimumDeposit);

  const validation = Yup.object().shape({
    lunax: Yup.number()
      .max(
        Number(availableAmount),
        `Unstake amount should be less than ${availableAmount} LUNA`
      )
      .min(minDep, `Unstake amount should be more than ${minDep} LUNA`)
      .required(`Unstake amount should be more than ${minDep} LUNA`),
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
        luna: 0,
        lunax: 0,
        ust: ustWalletBalance,
      }}
      onSubmit={(values) => {
        if (values.lunax) {
          handleUnstake(values.lunax);
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
                Available: {availableAmount} LunaX
              </Typography>

              <Typography
                variant={"body3"}
              >{`1 ${tokenLabel} = ${tvlExchangeRate.toFixed(
                6
              )} LUNA`}</Typography>
            </div>
            {errors.lunax && (
              <Typography
                variant={"caption1"}
                color={"textSecondary"}
                fontWeight={"medium"}
                className={"block mt-3 text-center"}
              >
                {errors.lunax}
              </Typography>
            )}
            <div className={"mt-4 mb-8 relative"}>
              <NumberInput
                {...lunaxProps}
                maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
                maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
                label="Enter Amount"
                onChange={(e) => {
                  let value = e.target.value;
                  setFieldValue(
                    "luna",
                    outputAmountLunaxToLuna(value, tvlExchangeRate)
                  );
                  setFieldValue("lunax", value);
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
              <span className={styles.arrow_down}>
                <img src="/static/arrowDown.png" alt="Arrow down" />
              </span>
            </div>
            <div className={"mb-6"}>
              <NumberInput
                {...lunaProps}
                maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
                maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
                label="Output Amount"
                value={lunaProps.value}
                onChange={() => {
                  return "";
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className={"text-white"}>LUNA</span>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </div>
            <div className={styles.percentage_buttons_container}>
              <PercentageButtons
                total={availableAmount}
                activeValue={lunaxProps.value}
                onClick={(value) => {
                  let val = Number(availableAmount) * value;
                  setFieldValue(
                    "luna",
                    outputAmountLunaxToLuna(val, tvlExchangeRate)
                  );
                  formik.setFieldValue("lunax", val.toFixed(6));
                }}
              />
              <Typography variant={"body3"} color={"textSecondary"}>
                Transaction Fee: {ustFee} UST
              </Typography>
            </div>
            <Divider color={"gradient"} />
            <div>
              <div className={styles.lunax_to_luna_info}>
                <Typography
                  variant={"body3"}
                  fontWeight={"medium"}
                  color={"secondary"}
                  component="li"
                >
                  Unstaking takes 21-24 days to unlock Luna. Unlock Luna
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
              <ButtonOutlined size={"large"} disabled={!Boolean(values.lunax)}>
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
