import { SPPoolsTableHead } from "../../molecules";
import useCommunityFarmingPools from "@hooks/useCommunityFarmingPools";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import styles from "./SPPoolTable.module.scss";
import { useState } from "react";
import { Loader } from "../../atoms";
import SPoolTableRowHead from "@organisms/SPoolTableRowHead/SPoolTableRowHead";

export default function SPPoolTable() {
  const { pools, poolsLoading, contractsInfo } = useCommunityFarmingPools();

  const [openPoolBody, setOpenPoolBody] = useState<{
    open: boolean;
    index: number | null;
  }>({ open: false, index: null });

  const [isTransactionOn, setIsTransactionOn] = useState<boolean>(false);

  const toggleIsTransactionOn = (val: boolean) => {
    setIsTransactionOn(val);
  };

  const toggleOpen = (index: number) => () => {
    if (!isTransactionOn) {
      setOpenPoolBody((prev) => {
        if (prev.open && index === prev.index) {
          return { open: false, index: null };
        } else {
          return { open: true, index: index };
        }
      });
    }
  };
  if (poolsLoading) {
    return (
      <div className="flex justify-center w-full mt-2">
        <Loader />;
      </div>
    );
  }
  return (
    <div className={styles.table}>
      <div className={styles.head}>
        <SPPoolsTableHead />
      </div>
      {pools &&
        pools.map((pool, index) => (
          <SPoolTableRowHead
            key={pool.pool_id}
            poolName={pool.name}
            apr={pool.computedApr}
            computedDeposit={
              nativeTokenFormatter(pool.computed_deposit || pool.deposit) || "0"
            }
            pool={pool}
            contracts={contractsInfo}
            onClick={toggleOpen(index)}
            openBody={openPoolBody.open && openPoolBody.index === index}
            onTransactionToggle={toggleIsTransactionOn}
            isTransactionOn={isTransactionOn}
          />
        ))}
    </div>
  );
}
