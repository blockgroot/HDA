import { ButtonOutlined } from "@atoms/Button/Button";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";
import {
  NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS,
  NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS,
} from "@constants/constants";
import { Typography } from "../../atoms";
import { InputProps } from "@material-ui/core";
import PercentageButtons from "@molecules/PercentageButtons/PercentageButtons";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import { FieldInputProps, FormikErrors } from "formik";
import { ChangeEvent } from "react";
import styles from "./LSPoolsFormLaToLx.module.scss";
type Props = {
  availableLabel: string;
  fromTokenProps: FieldInputProps<any>;
  fromTokenLabel: string;
  tokenCostLabel: string;
  transactionFeeLabel: string;
  buttonLabel: string;
  fromTokenInputProps: Partial<InputProps>;
  toTokenInputProps: Partial<InputProps>;
  toTokenProps: FieldInputProps<any>;
  maxIntegerPoinsts: number;
  maxDecimalPoints: number;
  walletBalance: number;
  errors: FormikErrors<{
    fromToken: number;
    toToken: number;
    fees: number;
  }>;
  onPercentageButtonsClick: (val: number) => void;
  onFromTokenChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onToTokenChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
};

export default function LSPoolsForm(props: Props): JSX.Element {
  const {
    fromTokenProps,
    toTokenProps,
    handleSubmit,
    availableLabel,
    fromTokenLabel,
    onFromTokenChange,
    onToTokenChange,
    onPercentageButtonsClick,
    fromTokenInputProps,
    tokenCostLabel,
    toTokenInputProps,
    walletBalance,
    transactionFeeLabel,
    buttonLabel,
    maxIntegerPoinsts,
    maxDecimalPoints,
    errors,
  } = props;

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div className={styles.available_amount_validation}>
        <div className="flex flex-row align-middle">
          <Typography variant={"body3"} color={"secondary"}>
            {availableLabel}
          </Typography>
        </div>
        <div className="flex flex-row align-middle">
          <Typography variant={"body3"}>{tokenCostLabel}</Typography>
          <SDTooltip
            content={"Actual exchange rate may vary from the displayed value"}
            className="text-white ml-1"
            fontSize="small"
          />
        </div>
      </div>

      <div className={"mt-4 mb-8 relative"}>
        <NumberInput
          {...fromTokenProps}
          maxIntegerPoinsts={maxIntegerPoinsts}
          maxDecimalPoints={maxDecimalPoints}
          label={fromTokenLabel}
          onChange={onFromTokenChange}
          InputProps={fromTokenInputProps}
          fullWidth
        />
        <span className={styles.arrow_down}>
          <img src="/static/arrowDown.png" alt="Arrow down" />
        </span>
      </div>
      <div className={"mb-6"}>
        <NumberInput
          {...toTokenProps}
          maxIntegerPoinsts={NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="Output Amount"
          value={toTokenProps.value}
          onChange={onToTokenChange}
          InputProps={toTokenInputProps}
          fullWidth
        />
      </div>
      <div className={styles.percentage_buttons_container}>
        <PercentageButtons
          total={walletBalance}
          activeValue={fromTokenProps.value}
          onClick={onPercentageButtonsClick}
        />
        <Typography variant={"body3"} color={"textSecondary"}>
          Transaction Fee: {transactionFeeLabel}
        </Typography>
      </div>
      {(errors.fees || errors.fromToken) && (
        <Typography
          variant={"body2"}
          color={"primary"}
          fontWeight={"medium"}
          className={"block mt-8 text-center"}
        >
          {errors.fees || errors.fromToken}
        </Typography>
      )}
      <div className="mt-8 lg:mt-8 flex justify-center">
        <ButtonOutlined
          className="w-[200px] h-[48px]"
          disabled={!!Object.keys(errors).length || fromTokenProps.value === 0}
          type="submit"
        >
          {buttonLabel}
        </ButtonOutlined>
      </div>
    </form>
  );
}
