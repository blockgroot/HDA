import PercentageButtons from "../PercentageButtons/PercentageButtons";
import { ButtonOutlined } from "@atoms/Button/Button";
import { Box, Loader, SuccessAnimation, Typography } from "../../atoms";
import { Formik } from "formik";
import * as Yup from "yup";
import { lunaFormatter } from "@utils/CurrencyHelper";
import { ustFeeStaking } from "@constants/constants";
import { useQuery } from "react-query";
import { SP_GAS_ESTIMATE } from "@constants/queriesKey";
import useDeposit from "@hooks/useDeposit";
import { useEffect, useState } from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Link from "next/link";
import styles from "./SPPoolDepositForm.module.scss";
import CloseIcon from "@material-ui/icons/Close";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import {
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from "@anchor-protocol/notation";
import { InputAdornment } from "@material-ui/core";

interface Props {
  walletBalance: number;
  ustWalletBalance: number;
  maxDeposit: number;
  minDeposit: number;
  contracts: any;
  poolId: number;
  onTransactionToggle: (val: boolean) => void;
}

const SPPoolDepositForm = (props: Props) => {
  const {
    walletBalance,
    ustWalletBalance,
    maxDeposit,
    minDeposit,
    contracts,
    poolId,
    onTransactionToggle,
  } = props;

  const {
    getEstimateTransFee,
    handleDepositAmount,
    isLoading,
    data: result,
    resetForm,
  } = useDeposit();
  const [amount, setAmount] = useState<number | string>(0);

  const handleFetchGasEstimate = async (amount: number) => {
    const { estimatedGasFee } = await getEstimateTransFee({
      amount,
      poolId: poolId,
      contracts: contracts,
    });

    return estimatedGasFee;
  };

  const {
    data,
    isLoading: queryLoading,
    refetch,
  } = useQuery(
    [SP_GAS_ESTIMATE, amount],
    () => handleFetchGasEstimate(amount as number),
    {
      enabled: false,
      retry: false,
    }
  );

  const handleSubmit = async (amount: number) => {
    handleDepositAmount({
      amount: amount,
      contracts: contracts,
      gasAmount: data,
      poolIndex: poolId,
    });
  };

  const minDep = lunaFormatter(minDeposit);
  const maxDep = Math.min(lunaFormatter(maxDeposit), walletBalance);

  const validation = Yup.object().shape({
    luna: Yup.number()
      .max(maxDep, `Deposit amount should be less than ${maxDep} LUNA`)
      .min(minDep, `Deposit amount should be more than ${minDep} LUNA`)
      .required(`Deposit amount should be more than ${minDep} LUNA`),
    ust: Yup.number().moreThan(
      ustFeeStaking,
      "Not enough ust for transaction fees"
    ),
  });

  const handleChange = (amount: string | number) => {
    setAmount(amount as number);
  };

  useEffect(() => {
    if (parseFloat(amount as string)) {
      refetch();
    }
  }, [amount]);

  useEffect(() => {
    if (isLoading) {
      onTransactionToggle(true);
    } else {
      onTransactionToggle(false);
    }
  }, [isLoading]);

  if (result?.success) {
    return (
      <Box
        noShadow
        noPadding
        className="p-3 flex flex-col items-center relative"
      >
        <CloseIcon
          className={styles.success_close_button}
          onClick={resetForm}
        />
        <SuccessAnimation width={70} />
        <Typography variant={"body2"} fontWeight={"semi-bold"}>
          {result.message}
        </Typography>
        {/*<DepositSuccess reset={resetForm} message={result.message} />*/}
        <div className={styles.success_info_wrap}>
          <Typography variant={"body3"} className={styles.success_info_text}>
            Rewards are set to 100% auto-compunding by default to maximize
            returns. To change the strategy, visit the{" "}
          </Typography>
          <Link href={"/strategies"}>
            <a className={styles.success_info_link}>
              Strategies page <ChevronRightIcon />
            </a>
          </Link>
        </div>
      </Box>
    );
  }

  const renderElement = (
    <div>
      <Formik
        initialValues={{ luna: 0, ust: ustWalletBalance || 0 }}
        onSubmit={(val) => {
          handleSubmit(val.luna);
        }}
        validationSchema={validation}
      >
        {(formik) => {
          const lunaProps = formik.getFieldProps("luna");
          const { errors, values } = formik;
          return (
            <form onSubmit={formik.handleSubmit}>
              <div className={styles.description_text_wrap}>
                <Typography
                  className={"text-secondary"}
                  fontWeight={"medium"}
                  variant={"body3"}
                >
                  Available LUNA: {walletBalance || 0}
                </Typography>
                <Typography variant={"body3"} className={"text-light-800"}>
                  {errors.ust ||
                    errors.luna ||
                    (values.luna && `Transaction Fee: ${ustFeeStaking} UST`) ||
                    null}
                </Typography>
              </div>
              <NumberInput
                {...lunaProps}
                maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
                maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
                label="Amount"
                onChange={(e) => {
                  let value = e.target.value;
                  formik.setFieldValue("luna", value);
                  handleChange(value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className="adornment">
                      <span className="text-white">LUNA</span>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              <div className={styles.percentage_buttons}>
                <PercentageButtons
                  total={walletBalance}
                  activeValue={lunaProps.value}
                  onClick={(val) => {
                    formik.setFieldValue(
                      "luna",
                      (walletBalance * val).toFixed(6)
                    );
                    handleChange(walletBalance * val);
                    // onChange(walletBalanceInt * val);
                  }}
                />
                <div className={styles.deposit_button}>
                  <ButtonOutlined
                    type={"submit"}
                    disabled={!formik.isValid || queryLoading}
                    size={"large"}
                  >
                    Deposit
                  </ButtonOutlined>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );

  return <>{isLoading ? <Loader width={170} /> : renderElement}</>;
};

export default SPPoolDepositForm;
