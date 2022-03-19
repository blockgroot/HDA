import {
  NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS,
  NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS,
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
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

  // const {
  //   outputAmountLiquidNativeTokenToNativeToken,
  //   handleUnstake,
  //   unStakingMutation,
  // } = useLSPoolsForm();

  const availableAmount = (holding / NATIVE_TOKEN_MULTIPLIER).toFixed(6);
  const minDep = nativeTokenFormatter(minimumDeposit);

  const validation = Yup.object().shape({
    liquidNativeToken: Yup.number()
      .max(
        Number(availableAmount),
        `Unstake amount should be less than ${availableAmount} ${NATIVE_TOKEN_LABEL}`
      )
      .min(
        minDep,
        `Unstake amount should be more than ${minDep} ${NATIVE_TOKEN_LABEL}`
      )
      .required(
        `Unstake amount should be more than ${minDep} ${NATIVE_TOKEN_LABEL}`
      ),
    ust: Yup.number().moreThan(ustFee, "Not enough ust for transaction fees"),
  });

  // if (unStakingMutation.isLoading) return <Loader position={"center"} />;
  // if (unStakingMutation.data?.success) {
  //   return (
  //     <div className="flex flex-col flex-center">
  //       <div className="mb-4">
  //         <SuccessAnimation width={"100px"} height={"100px"} />
  //       </div>

  //       <Typography variant={"body2"} fontWeight={"semi-bold"}>
  //         {unStakingMutation.data?.message}
  //       </Typography>

  //       <div className="mt-4">
  //         <ButtonOutlined onClick={unStakingMutation.reset} size={"large"}>
  //           Done
  //         </ButtonOutlined>
  //       </div>
  //     </div>
  //   );
  // }
  return <div className={styles.root}></div>;
}

export default LSPoolsFormLxToLa;
