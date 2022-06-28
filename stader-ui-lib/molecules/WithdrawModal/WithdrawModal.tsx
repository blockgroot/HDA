import { Dialog } from "@material-ui/core";
import styles from "./WithdrawModal.module.scss";
import CloseIcon from "@material-ui/icons/Close";
import { WithdrawModalForm } from "./WithdrawModalForm";
import { Box, Loader, Typography } from "../../atoms";
import { ButtonOutlined } from "@atoms/Button/Button";
import { UndelegateData } from "@hooks/useWithdrawals";
import useHashConnect from "@hooks/useHashConnect";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import { getAnalytics, logEvent } from "firebase/analytics";

type WithdrawModalProps = {
  modal: boolean;
  walletBalance: number;
  closeModal: () => void;
  claim: UndelegateData | undefined;
};

export default function WithdrawModal(props: WithdrawModalProps) {
  const { modal, closeModal, claim, walletBalance } = props;
  const { selectedAccount, withdrawStatus, setWithdrawStatus, withdraw } =
    useHashConnect();

  const ErrSVG = () => (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="38" stroke="#3E3E3E" strokeWidth="4" />
      <path
        d="M41.8225 51.1775C42.3634 51.7183 42.6338 52.3793 42.6338 53.1606C42.6338 53.9418 42.3634 54.6028 41.8225 55.1437C41.2817 55.7146 40.6206 56 39.8394 56C39.0582 56 38.3972 55.7146 37.8563 55.1437C37.2854 54.6028 37 53.9418 37 53.1606C37 52.3793 37.2854 51.7183 37.8563 51.1775C38.3972 50.6366 39.0582 50.3662 39.8394 50.3662C40.6206 50.3662 41.2817 50.6366 41.8225 51.1775ZM42.1831 24L42.1831 46.9859L37.4507 46.9859L37.4507 24L42.1831 24Z"
        fill="#3E3E3E"
      />
    </svg>
  );

  const handleCloseModal = () => {
    setWithdrawStatus("NONE");
    closeModal();
  };

  const analytics = getAnalytics();
  logEvent(analytics, "withdraw_status", { value: withdrawStatus });

  return (
    <Dialog open={modal} classes={{ paper: styles.dialog }}>
      {withdrawStatus === "FAILED" && (
        <Box className={styles.root} noPadding>
          <div className={styles.container}>
            <div className="flex flex-col justify-center align-middle content-center pl-12 pr-12 pb-6">
              <div className="justify-center flex p-10 mt-10">
                <ErrSVG />
              </div>
              <div
                className="justify-center flex p-2"
                style={{ textAlign: "center" }}
              >
                <Typography variant={"body1"} fontWeight="bold">
                  Something went wrong. Please try again.
                </Typography>
              </div>
              <div className="justify-center flex p-5 mt-3">
                <ButtonOutlined
                  className="w-[200px] h-[48px]"
                  type="submit"
                  onClick={handleCloseModal}
                >
                  Try again
                </ButtonOutlined>
              </div>
            </div>
          </div>
        </Box>
      )}
      {/* {withdrawStatus !== "IN_PROGRESS" && (
        <CloseIcon
          onClick={() => closeModal()}
          className={styles.dialog_close_icon}
        />
      )} */}
      {withdrawStatus === "NONE" && claim !== undefined && (
        <div
          className={`${styles.root} bg-dark-600 rounded-3xl border border-dark-200 shadow-box `}
        >
          <WithdrawModalForm
            walletBalance={walletBalance}
            handleSubmit={(amount) => withdraw(claim.index)}
            claim={claim}
            account={selectedAccount}
            handleCloseModal={handleCloseModal}
          ></WithdrawModalForm>
        </div>
      )}
      {withdrawStatus === "IN_PROGRESS" && (
        <Box className={styles.root} noPadding>
          <div className={styles.container}>
            <Loader
              position={"center"}
              text="Your transaction is in progress..."
            />
          </div>
        </Box>
      )}
      {withdrawStatus == "SUCCESS" && (
        <Box className={styles.root} noPadding>
          <div className={styles.container}>
            <div className="flex flex-col justify-center align-middle content-center pl-12 pr-12 pb-6">
              <div className="justify-center flex p-5 mt-1">
                <img src={"/static/success.gif"} width={200} alt="success" />
              </div>
              <div
                className="justify-center flex p-2"
                style={{ textAlign: "center" }}
              >
                <Typography variant={"body1"} fontWeight="bold">
                  {nativeTokenFormatter(claim?.amount!)} HBAR has been
                  successfully withdrawn to your wallet {selectedAccount}
                </Typography>
              </div>
              <div className="justify-center flex p-5 mt-3">
                <ButtonOutlined
                  className="w-[200px] h-[48px]"
                  type="submit"
                  onClick={handleCloseModal}
                >
                  OK
                </ButtonOutlined>
              </div>
            </div>
          </div>
        </Box>
      )}
    </Dialog>
  );
}
