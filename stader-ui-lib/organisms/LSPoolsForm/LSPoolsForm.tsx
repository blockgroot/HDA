import LSPoolsFormStake from "@molecules/LSPoolsForms/LSPoolsFormStake";
import LSPoolsFormUnstake from "@molecules/LSPoolsForms/LSPoolsFormUnstake";
import { Box, Loader, Tab, Tabs } from "../../atoms";
import { useState } from "react";
import { LSPoolProps } from "@types_/liquid-staking-pool";
import styles from "./LSPoolsForm.module.scss";

function LSPoolsForm(props: LSPoolProps) {
  const { handleStake, tvlLoading, contractConfig, holding } = props;

  const [tab, setTab] = useState<number>(0);
  const handleTabChange = (val: number) => {
    setTab(val);
  };

  console.log("handleStake", handleStake);
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
              <LSPoolsFormStake
                tvlExchangeRate={1}
                walletBalance={holding}
                ustWalletBalance={0}
                maximumDeposit={contractConfig.max_deposit}
                minimumDeposit={contractConfig.min_deposit}
                handleStake={handleStake}
              />
            )}
            {tab === 1 && <LSPoolsFormUnstake />}
          </>
        )}
      </div>
    </Box>
  );
}

export default LSPoolsForm;
