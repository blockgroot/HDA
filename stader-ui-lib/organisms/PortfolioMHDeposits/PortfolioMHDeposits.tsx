import React, { useState } from "react";
import { getContractByName } from "@utils/contractFilters";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import { Box, Button, Divider, Typography } from "../../atoms";
import PortfolioNoItem from "@molecules/PortfolioNoItem/PortfolioNoItem";
import SPDepositUndelegateModal from "@molecules/SPDepositUndelegateModal/SPDepositUndelegateModal";
import { defaultDepositUndelegationProps } from "@constants/sp-portfolio";
import { SPDepositUndelegationModalProps } from "@types_/portfolio";
import PoolDescription from "@molecules/PoolDescription/PoolDescription";
import styles from "./PortfolioMHDeposits.module.scss";
import SPManageHoldingNativeTokenLists from "@molecules/SPManageHoldingNativeTokenLists/SPManageHoldingNativeTokenLists";

interface Props {
  contracts: any;
  poolsInfo: any;
  poolsUndelegations: any;
  delegatorConfig: any;
  gasPrices: any;
}

type ModalStateProps = Omit<SPDepositUndelegationModalProps, "onClose">;

function PortfolioMHDeposits({
  contracts,
  poolsInfo,
  poolsUndelegations,
  delegatorConfig,
  gasPrices,
}: Props) {
  // const [openUndelegateDialog, undelegateDialogElement] = useUndelegateDialog();

  const [modal, setModal] = useState<ModalStateProps>(
    defaultDepositUndelegationProps
  );

  const openModal = (props: ModalStateProps) => {
    setModal(props);
  };

  const closeModal = () => {
    setModal(defaultDepositUndelegationProps);
  };

  return (
    <div>
      <Typography variant={"h2"} fontWeight={"bold"} className={"mb-4"}>
        Deposits
      </Typography>
      <Box noPadding>
        {poolsInfo.length &&
          poolsInfo.map((pool: any, index: number) => (
            <SPManageHoldingNativeTokenLists
              key={pool.pool_id}
              label={<PoolDescription name={pool.pool_name} />}
              value={
                pool.computed_deposit && pool.computed_deposit > 0
                  ? nativeTokenFormatter(pool.computed_deposit)
                  : pool.deposit.staked > 0
                  ? nativeTokenFormatter(pool.deposit.staked)
                  : 0
              }
              button={
                <Button
                  size={"small"}
                  className={styles.button}
                  disabled={
                    parseInt(pool.deposit.staked) < 1000 ||
                    (poolsUndelegations &&
                      poolsUndelegations.length >=
                        delegatorConfig.undelegations_max_limit)
                  }
                  onClick={() =>
                    openModal({
                      poolId: pool.pool_id,
                      maxAmount: parseFloat(
                        (pool.deposit.staked / 1000000).toFixed(6)
                      ),
                      protocolFee:
                        delegatorConfig && delegatorConfig.protocol_fee
                          ? delegatorConfig.protocol_fee * 100
                          : 1,
                      title: pool.pool_name.includes("Airdrops Plus")
                        ? "Airdrops Plus"
                        : pool.pool_name.includes("Community")
                        ? "Community"
                        : "Blue Chip",
                      contractAddress: getContractByName(contracts, "pools"),
                      open: true,
                    })
                  }
                >
                  Undelegate
                </Button>
              }
            />
          ))}

        {!poolsInfo.length && <PortfolioNoItem type={"deposit"} />}
      </Box>
      {modal.open && (
        <SPDepositUndelegateModal onClose={closeModal} {...modal} />
      )}
    </div>
  );
}

export default PortfolioMHDeposits;
