import LSPoolsFormLaToLx from "@molecules/LSPoolsForms/LSPoolsFormLaToLx";
import LSPoolsFormLxToLa from "@molecules/LSPoolsForms/LSPoolsFormLxToLa";
import { Box, Loader, Tab, Tabs } from "../../atoms";
import { useState } from "react";
import { LSPoolProps } from "@types_/liquid-staking-pool";
import { useAppContext } from "@libs/appContext";
import styles from "./LSPoolsForm.module.scss";

function LSPoolsForm(props: LSPoolProps) {
  const { tvl, tvlLoading, contractConfig, holding } = props;

  const [tab, setTab] = useState<number>(0);
  const handleTabChange = (val: number) => {
    setTab(val);
  };

  const { lunaBalance, ustBalance } = useAppContext();

  if (tvlLoading) {
    return (
      <Box className={"mt-8 px-10 py-6"}>
        <Loader position={"center"} />
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
                  tvlExchangeRate={tvl?.exchangeRate}
                  walletBalance={lunaBalance}
                  ustWalletBalance={ustBalance}
                  maximumDeposit={contractConfig.max_deposit}
                  minimumDeposit={contractConfig.min_deposit}
                />
              )}
              {tab === 1 && (
                <LSPoolsFormLxToLa
                  tvlExchangeRate={tvl?.exchangeRate}
                  maximumDeposit={contractConfig.max_deposit}
                  minimumDeposit={contractConfig.min_deposit}
                  holding={holding}
                  ustWalletBalance={ustBalance}
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
