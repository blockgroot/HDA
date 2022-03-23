import LSPoolsFormStake from "@molecules/LSPoolsForms/LSPoolsFormStake";
import LSPoolsFormUnstake from "@molecules/LSPoolsForms/LSPoolsFormUnstake";
import { Box, Loader, Tab, Tabs, Typography, Link } from "../../atoms";
import React, { useState } from "react";
import { LSPoolProps } from "@types_/liquid-staking-pool";
import styles from "./LSPoolsForm.module.scss";
import { ButtonOutlined } from "@atoms/Button/Button";

const TickSVG = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <rect width="100" height="100" fill="url(#pattern0)" />
    <defs>
      <pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_109_2"
          transform="translate(-0.010101) scale(0.00505051)"
        />
      </pattern>
      <image
        id="image0_109_2"
        width="202"
        height="198"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

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
    contractConfig,
    holding,
    transactionStatus,
    tvlLoading,
    setTransactionStatus,
  } = props;

  const [tab, setTab] = useState<number>(0);
  const handleTabChange = (val: number) => {
    setTab(val);
  };

  // console.log("transactionStatus", transactionStatus);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("handleClick");
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
              <TickSVG />
            </div>
            <div className="justify-center flex p-2">
              <Typography variant={"body1"} fontWeight="bold">
                Staking of HBAR is successful!
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
                ustWalletBalance={0}
                maximumDeposit={contractConfig.max_deposit}
                minimumDeposit={contractConfig.min_deposit}
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
