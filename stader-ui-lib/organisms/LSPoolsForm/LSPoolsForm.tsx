import LSPoolsFormLaToLx from "@molecules/LSPoolsForms/LSPoolsFormLaToLx";
import LSPoolsFormLxToLa from "@molecules/LSPoolsForms/LSPoolsFormLxToLa";
import { Box, Divider, Loader, Tab, Tabs, Typography } from "../../atoms";
import React, { useState } from "react";

import { useAppContext } from "@libs/appContext";
import styles from "./LSPoolsForm.module.scss";
import { ButtonOutlined } from "@atoms/Button/Button";

export type TvlType = {
  uluna: number;
  valueInUSD: number;
  exchangeRate: number;
};

export type LSPoolProps = {
  tvl: number;
  tvlLoading?: boolean;
  contractConfig: ContractConfigType;
  holding: number;
  isAssocciated: boolean;
  associateToken: () => void;
  handleStake: (amount: number) => void;
};

export type ContractConfigType = {
  min_deposit: number;
  max_deposit: number;
  protocol_withdraw_fee: number;
};

function LSPoolsForm(props: LSPoolProps) {
  const {
    tvl,
    tvlLoading,
    contractConfig,
    holding,
    isAssocciated,
    associateToken,
    handleStake,
  } = props;

  const [tab, setTab] = useState<number>(0);
  const handleTabChange = (val: number) => {
    setTab(val);
  };

  const handleAssocuiteToken = (e: React.MouseEvent) => {
    e.preventDefault;
    console.log("associateToken");
    associateToken();
  };

  const doHandleStake = (value: number) => {
    console.log("Stake");
    handleStake(value);
  };

  if (tvlLoading) {
    return (
      <Box className={"mt-8 px-10 py-6 h-4"}>
        <Loader position={"center"} />
      </Box>
    );
  }

  if (!isAssocciated) {
    return (
      <Box className={styles.root} noShadow noPadding>
        <Box className={"mt-8 px-10 py-6"}>
          <div className="lg:mb-8">
            <div className="p-1 text-center mb-2">
              <Typography variant={"h2"}>Associate hbarx</Typography>
            </div>
            <div className="p-1 text-center mb-2">
              <Typography variant={"body1"} color={"textSecondary"}>
                To undertake staking and obtain hbarx, you must first associate
                hbarx with your account.
              </Typography>
            </div>
          </div>

          {/* <Divider color={"gradient"} /> */}
          <div className="mt-6 lg:mt-12 flex justify-center">
            <ButtonOutlined
              size={"large"}
              onClick={handleAssocuiteToken}
              // disabled={!!Object.keys(errors).length || !values.luna}
            >
              Associate
            </ButtonOutlined>
          </div>
        </Box>
      </Box>
    );
  }
  return (
    <Box className={styles.root} noShadow noPadding>
      <div className={styles.container}>
        <Tabs onChange={handleTabChange} value={tab}>
          <Tab label={"Stake"} value={0} />
          <Tab label={"Unstake"} value={1} />
        </Tabs>
        <Box className={styles.form_wrapper} noPadding>
          {tvlLoading ? (
            <Loader position={"center"} />
          ) : (
            <>
              {tab === 0 && (
                <LSPoolsFormLaToLx
                  tvlExchangeRate={1}
                  walletBalance={holding}
                  ustWalletBalance={5}
                  maximumDeposit={contractConfig.max_deposit}
                  minimumDeposit={contractConfig.min_deposit}
                  stake={doHandleStake}
                />
              )}
              {tab === 1 && (
                <LSPoolsFormLxToLa
                  tvlExchangeRate={1}
                  maximumDeposit={contractConfig.max_deposit}
                  minimumDeposit={contractConfig.min_deposit}
                  holding={holding}
                  ustWalletBalance={0}
                />
              )}
            </>
          )}
        </Box>
      </div>
    </Box>
  );
}

export default LSPoolsForm;
