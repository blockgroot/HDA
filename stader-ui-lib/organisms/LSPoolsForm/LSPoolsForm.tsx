import { ButtonOutlined } from "@atoms/Button/Button";
import { Hbar } from "@hashgraph/sdk";
import LSPoolsFormStake from "@molecules/LSPoolsForms/LSPoolsFormStake";
import LSPoolsFormUnstake from "@molecules/LSPoolsForms/LSPoolsFormUnstake";
import LSPoolsFormClaim from "@molecules/LSPoolsForms/LSPoolsFromClaim";
import { LSPoolProps } from "@types_/liquid-staking-pool";
import { getAnalytics, logEvent } from "firebase/analytics";
import useWithdrawals from "hooks/useWithdrawals";
import React, { useEffect, useState } from "react";
import { Box, Loader, Tab, Tabs, Typography } from "../../atoms";
import styles from "./LSPoolsForm.module.scss";

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

function LSPoolsForm(props: LSPoolProps) {
  const {
    exchangeRate,
    handleStake,
    handleUnstake,
    handleWithdraw,
    holding,
    transactionStatus,
    transactionType,
    setTransactionStatus,
    withdrawStatus,
  } = props;

  const [amount, setAmount] = useState<number>(0);
  const [hbarXAmount, setHbarXAmount] = useState<number>(0);
  const [tab, setTab] = useState<number>(0);
  const { data, getUnStakeData } = useWithdrawals();

  const handleTabChange = (val: number) => {
    const tabValue = val == 0 ? "stake" : val == 1 ? "unstake" : "withdraw";
    logEvent(analytics, "tab_clicked", { value: tabValue });
    setTab(val);
  };

  useEffect(() => {
    getUnStakeData();
    // console.log(`transactionStatus`, transactionStatus);
    // console.log(`withdrawStatus`, withdrawStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionStatus, withdrawStatus]);

  const onStakeSent = (amount: number) => {
    amount = parseFloat(amount.toString());
    setAmount(amount);
    setHbarXAmount(amount * exchangeRate);
    handleStake(amount);
  };

  const onUnstakeSent = (amount: number) => {
    amount = parseFloat(amount.toString());
    setAmount(amount);
    setHbarXAmount(amount);
    handleUnstake(amount, 1 / exchangeRate);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setTransactionStatus("");
    if (transactionType === "unstake") {
      setTab(2);
    }
  };

  const handleTryAgain = (e: React.MouseEvent) => {
    e.preventDefault();
    setTransactionStatus("");
  };

  const unstakeReady = true;
  const analytics = getAnalytics();
  if (transactionStatus === "FAILED") {
    transactionType === "stake"
      ? logEvent(analytics, "stake_transaction_failed", { hbar: amount })
      : logEvent(analytics, "unstake_transaction_failed", {
          hbarx: Hbar.fromTinybars(hbarXAmount).toBigNumber().toNumber(),
        });

    return (
      <Box className={styles.root} noPadding>
        <div className={styles.container}>
          <div className="flex flex-col justify-center align-middle content-center">
            <div className="justify-center flex p-10 mt-10">
              <ErrSVG />
            </div>
            <div className="justify-center flex p-2 text-center">
              {transactionType === "stake" && (
                <Typography variant={"body1"} fontWeight="bold">
                  Something went wrong, please try again! <br />
                  <br /> We have refunded your {amount} HBAR.
                </Typography>
              )}
              {transactionType === "unstake" && (
                <Typography variant={"body1"} fontWeight="bold">
                  Something went wrong, please try again! <br />
                  <br /> We have refunded your{" "}
                  {Hbar.fromTinybars(hbarXAmount).toBigNumber().toNumber()}{" "}
                  HBARX.
                </Typography>
              )}
            </div>

            <div className="justify-center flex p-5 mt-3">
              <ButtonOutlined
                className="w-[200px] h-[48px]"
                type="submit"
                onClick={handleTryAgain}
              >
                Try Again
              </ButtonOutlined>
            </div>
          </div>
        </div>
      </Box>
    );
  } else if (transactionStatus === "SUCCESS") {
    // logEvent(analytics, "transaction_success", {
    //   hbar: amount,
    //   hbarx: Hbar.fromTinybars(hbarXAmount).toBigNumber().toNumber(),
    //   type: transactionType,
    // });
    transactionType === "stake"
      ? logEvent(analytics, "stake_transaction_success", { hbar: amount })
      : logEvent(analytics, "unstake_transaction_success", {
          hbarx: Hbar.fromTinybars(hbarXAmount).toBigNumber().toNumber(),
        });
    return (
      <Box className={styles.root} noPadding>
        <div className={styles.container}>
          <div className="flex flex-col justify-center align-middle content-center">
            <div className="justify-center flex p-10 mt-10">
              <img src={"/static/success.gif"} width={200} alt="success" />
            </div>
            <div className="justify-center flex p-2">
              {transactionType === "stake" && (
                <Typography variant={"body1"} fontWeight="bold">
                  Staking of {amount} HBAR is successful!
                </Typography>
              )}
              {transactionType === "unstake" && (
                <Typography variant={"body1"} fontWeight="bold">
                  Unstaking of{" "}
                  {Hbar.fromTinybars(hbarXAmount).toBigNumber().toNumber()}{" "}
                  HBARX is successful!
                </Typography>
              )}
            </div>
            <div className="justify-center flex p-5 mt-3">
              <ButtonOutlined
                className="w-[200px] h-[48px]"
                type="submit"
                onClick={handleClick}
              >
                Done
              </ButtonOutlined>
            </div>
          </div>
        </div>
      </Box>
    );
  } else if (transactionStatus === "START") {
    logEvent(analytics, "transaction_start", {
      hbar: amount,
    });
    return (
      <Box className={styles.root} noPadding>
        <div className={styles.container}>
          <Loader
            position={"center"}
            text={`Your transaction is in progress...`}
          />
        </div>
      </Box>
    );
  } else {
    return (
      <Box className={styles.root} noPadding>
        <div className={styles.container}>
          <Tabs onChange={handleTabChange} value={tab}>
            <Tab label={"Stake"} value={0} />
            <Tab label={"Unstake"} value={1} />
            <Tab label={"Withdraw"} value={2} subText="" />
          </Tabs>
          <>
            {tab === 0 && (
              <LSPoolsFormStake
                tvlExchangeRate={exchangeRate}
                walletBalance={holding}
                handleStake={onStakeSent}
              />
            )}
            {tab === 1 && (
              <LSPoolsFormUnstake
                tvlExchangeRate={exchangeRate}
                walletBalance={holding}
                handleUnstake={onUnstakeSent}
                readyState={unstakeReady}
              />
            )}

            {tab === 2 && (
              <LSPoolsFormClaim
                walletBalance={holding}
                handleClaim={getUnStakeData}
                undelegateData={data}
              />
            )}
          </>
        </div>
      </Box>
    );
  }
}

export default LSPoolsForm;
