import LSPoolsFormStake from "@molecules/LSPoolsForms/LSPoolsFormStake";
import LSPoolsFormUnstake from "@molecules/LSPoolsForms/LSPoolsFormUnstake";
import { Box, Loader, Tab, Tabs, Typography, Link } from "../../atoms";
import React, { useState } from "react";
import { LSPoolProps } from "@types_/liquid-staking-pool";
import styles from "./LSPoolsForm.module.scss";
import { ButtonOutlined } from "@atoms/Button/Button";
import { transactionFees } from "@constants/constants";

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
    holding,
    transactionStatus,
    setTransactionStatus,
  } = props;

  const [tab, setTab] = useState<number>(0);
  const handleTabChange = (val: number) => {
    setTab(val);
  };

  // console.log("transactionStatus", transactionStatus);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setTransactionStatus("");
  };

  if (transactionStatus === "FAILED") {
    return (
      <Box className={styles.root} noPadding>
        <div className={styles.container}>
          <div className="flex flex-col justify-center align-middle content-center">
            <div className="justify-center flex p-10 mt-10">
              <ErrSVG />
            </div>
            <div className="justify-center flex p-2">
              <Typography variant={"body1"} fontWeight="bold">
                Something went wrong, please try again!
              </Typography>
            </div>
            <div className="justify-center flex p-5 mt-3">
              <ButtonOutlined
                className="w-[200px] h-[48px]"
                type="submit"
                onClick={handleClick}
              >
                Try Again
              </ButtonOutlined>
            </div>
          </div>
        </div>
      </Box>
    );
  } else if (transactionStatus === "SUCCESS") {
    return (
      <Box className={styles.root} noPadding>
        <div className={styles.container}>
          <div className="flex flex-col justify-center align-middle content-center">
            <div className="justify-center flex p-10 mt-10">
              <img src={"/static/success.gif"} width={200} alt="success" />
            </div>
            <div className="justify-center flex p-2">
              <Typography variant={"body1"} fontWeight="bold">
                HBAR Staked successfully!
              </Typography>
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
    return (
      <Box className={styles.root} noPadding>
        <div className={styles.container}>
          <Loader
            position={"center"}
            text="Your transaction is in progress..."
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
            <Tab label={"Unstake"} value={1} subText="(Coming Soon)" />
          </Tabs>
          <>
            {tab === 0 && (
              <LSPoolsFormStake
                tvlExchangeRate={exchangeRate}
                walletBalance={holding}
                handleStake={handleStake}
              />
            )}
            {tab === 1 && <LSPoolsFormUnstake />}
          </>
        </div>
      </Box>
    );
  }
}

export default LSPoolsForm;
