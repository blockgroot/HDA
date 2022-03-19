import LSPoolsFormLaToLx from "@molecules/LSPoolsForms/LSPoolsFormLaToLx";
import LSPoolsFormLxToLa from "@molecules/LSPoolsForms/LSPoolsFormLxToLa";
import { Box, Loader, Tab, Tabs } from "../../atoms";
import { useState } from "react";
import { LSPoolProps } from "@types_/liquid-staking-pool";
import styles from "./LSPoolsForm.module.scss";

function LSPoolsForm(props: LSPoolProps) {
  const { tvl, tvlLoading, contractConfig, holding } = props;

  const [tab, setTab] = useState<number>(0);
  const handleTabChange = (val: number) => {
    setTab(val);
  };

  if (tvlLoading) {
    return (
      <Box className={"mt-8 px-10 py-6"}>
        <Loader position={"center"} />
      </Box>
    );
  }
  return (
    <Box className={styles.root} noPadding>
      <div className={styles.container}>
        <Tabs onChange={handleTabChange} value={tab}>
          <Tab label={"Stake"} value={0} />
          <Tab label={"Unstake"} value={1} />
        </Tabs>

        {tvlLoading ? (
          <Loader position={"center"} />
        ) : (
          <>
            {tab === 0 && (
              <LSPoolsFormLaToLx
                tvlExchangeRate={1}
                walletBalance={holding}
                ustWalletBalance={0}
                maximumDeposit={contractConfig.max_deposit}
                minimumDeposit={contractConfig.min_deposit}
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
      </div>
    </Box>
  );
}

export default LSPoolsForm;
