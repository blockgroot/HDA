import { ButtonOutlined } from "@atoms/Button/Button";
import { NATIVE_TOKEN_LABEL } from "@constants/constants";
import useTransactionFee from "@hooks/useTransactionFee";
import { UndelegateData } from "@hooks/useWithdrawals";
import { TextInput } from "@terra-dev/neumorphism-ui/components/TextInput";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import { FieldInputProps } from "formik";
import { Formik } from "formik";
import { Typography } from "../../atoms";
import * as Yup from "yup";
import CloseIcon from "@material-ui/icons/Close";
import styles from "./WithdrawModalForm.module.scss";

type WithdrawModalFormProps = {
  account: string;
  claim: UndelegateData;
  walletBalance: number;
  handleSubmit: (amount: number) => void;
  handleCloseModal: () => void;
};
export function WithdrawModalForm(props: WithdrawModalFormProps): JSX.Element {
  const { handleSubmit, account, claim, walletBalance, handleCloseModal } =
    props;
  const { fee } = useTransactionFee();

  const validation = Yup.object().shape({
    amount: Yup.number().required(),
    fee: Yup.number().lessThan(
      walletBalance,
      "Not enough HBAR for transaction"
    ),
  });
  const initialValues = {
    amount: claim.amount,
    fee,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        handleSubmit(values.amount);
      }}
      validationSchema={validation}
      validateOnMount={true}
    >
      {(formik) => {
        const { handleSubmit, getFieldProps, errors } = formik;
        const fromTokenProps: FieldInputProps<any> = getFieldProps("amount");
        const transactionFeeLabel = `${nativeTokenFormatter(
          fee
        )} ${NATIVE_TOKEN_LABEL} (ℏ)`;

        return (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div className={"mt-8 mb-3"}>
              <Typography
                variant={"h2"}
                color={"textSecondary"}
                className={"text-white"}
              >
                Withdraw HBAR
                <CloseIcon
                  onClick={() => {
                    handleCloseModal();
                  }}
                  className={styles.withdraw_modal_form_close_icon}
                />
              </Typography>
            </div>
            <div className={"mb-6 p-6"}>
              {
                <TextInput
                  {...fromTokenProps}
                  label={""}
                  value={`${nativeTokenFormatter(
                    fromTokenProps.value
                  )} ${NATIVE_TOKEN_LABEL}`}
                  InputProps={{
                    endAdornment: (
                      <Typography
                        variant={"body3"}
                        color={"textSecondary"}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Transaction Fee: ~ {transactionFeeLabel}
                      </Typography>
                    ),
                    readOnly: true,
                  }}
                  fullWidth
                />
              }
            </div>
            <div className={"pl-6 pr-6"}>
              <Typography
                variant={"body1"}
                color={"textSecondary"}
                style={{ textAlign: "center" }}
              >
                HBAR withdrawn will go to your wallet <span>{account}</span>
              </Typography>
            </div>
            {errors.fee && (
              <Typography
                variant={"body2"}
                color={"primary"}
                fontWeight={"medium"}
                className={"block mt-8 text-center"}
              >
                {errors.fee}
              </Typography>
            )}
            <div className={"p-6"}>
              <ButtonOutlined
                disabled={!!Object.keys(errors).length}
                type="submit"
              >
                Confirm
              </ButtonOutlined>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}
