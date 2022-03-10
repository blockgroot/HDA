import { NATIVE_TOKEN_LABEL, poolsDetails } from "@constants/constants";
import styles from "./SPoolTableRowHead.module.scss";
import { Box, Icon, Tag, Typography } from "../../atoms";
import SPPoolDepositForm from "@molecules/SPPoolDepositForm/SPPoolDepositForm";
import ValidatorsTable from "@molecules/ValidatorTable/ValidatorsTable";
import { PoolsName } from "@types_/stake-pools";
import { useAppContext } from "@libs/appContext";
import PoolDescription from "@molecules/PoolDescription/PoolDescription";
import classNames from "classnames";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { ButtonOutlined } from "@atoms/Button/Button";
import BottomModal from "@atoms/BottomModal/BottomModal";
import { useState } from "react";

type HeaderProps = {
  poolName: PoolsName;
  computedDeposit: number | string;
  apr: string;
  onClick?: () => void;
  pool: any;
  contracts: any;
  openBody: boolean;
  onTransactionToggle: (val: boolean) => void;
  isTransactionOn: boolean;
};
const SPoolTableRowHead = (props: HeaderProps) => {
  const {
    poolName,
    computedDeposit,
    apr,
    contracts,
    onClick,
    pool,
    openBody,
    onTransactionToggle,
    isTransactionOn,
  } = props;
  const { ustBalance, nativeTokenBalance } = useAppContext();
  const [bottomModal, setBottomModal] = useState<boolean>(false);

  const openModal = () => {
    setBottomModal(true);
  };

  console.log(isTransactionOn);

  const closeModal = () => {
    if (!isTransactionOn) {
      setBottomModal(false);
    }
  };

  return (
    <Box className={styles.root} gradientBorderHover noPadding>
      <div onClick={onClick}>
        <div className={styles.head}>
          <div className={styles.pool_name_column}>
            <PoolDescription name={poolName} />
            <div className={classNames(styles.desktop_tags, styles.tags)}>
              {poolsDetails[poolName].tags.map((tag: string) => (
                <Tag key={tag}>
                  <Typography variant={"caption1"}>{tag}</Typography>
                </Tag>
              ))}
            </div>
          </div>

          <div className={styles.col_2}>
            <div className={styles.my_deposit_desktop}>
              <Typography
                className={"mr-2"}
                variant={"h3"}
                fontWeight={"medium"}
              >
                {computedDeposit}
              </Typography>
              <Typography variant={"body3"} fontWeight={"medium"}>
                {NATIVE_TOKEN_LABEL}
              </Typography>
            </div>
          </div>
          <div className={styles.col_2}>
            <Typography variant={"h3"} fontWeight={"medium"}>
              {apr || "0"}%
            </Typography>
          </div>
          <div
            className={classNames(styles.col_last, styles.dropdown_button_wrap)}
          >
            <div className={styles.dropdown_button} role={"button"}>
              {openBody ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </div>
          </div>
        </div>

        <div className={styles.my_deposit_mobile}>
          <Typography className={"mr-2"} variant={"h3"} fontWeight={"medium"}>
            {computedDeposit}
          </Typography>
          <Typography variant={"body3"} fontWeight={"medium"}>
            {NATIVE_TOKEN_LABEL}
          </Typography>
        </div>
        <div className={styles.mobile_bottom_section}>
          <div className={styles.tags}>
            {poolsDetails[poolName].tags.map((tag: string) => (
              <Tag key={tag}>
                <Typography variant={"caption1"}>{tag}</Typography>
              </Tag>
            ))}
          </div>
          <div className={styles.dropdown_button_wrap}>
            <div className={styles.dropdown_button} role={"button"}>
              {openBody ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </div>
          </div>
        </div>
      </div>
      {openBody && (
        <div className={styles.body}>
          <Typography variant={"body2"} fontWeight={"medium"}>
            {
              poolsDetails[
                pool.name.replace("Pool", "").includes("Airdrops Plus")
                  ? "Airdrops Plus"
                  : (pool.name.replace("Pool", "") as keyof typeof poolsDetails)
              ].description
            }
            <a
              className={styles.learn_more_link}
              href={
                poolsDetails[
                  pool.name.replace("Pool", "").includes("Airdrops Plus")
                    ? "Airdrops Plus"
                    : (pool.name.replace(
                        "Pool",
                        ""
                      ) as keyof typeof poolsDetails)
                ].faq
              }
              target={"_blank"}
              rel="noreferrer"
            >
              Learn more
            </a>{" "}
          </Typography>
          <div className={styles.form_table}>
            <div className={styles.form}>
              <Box noShadow noPadding className="p-6 h-full">
                <SPPoolDepositForm
                  walletBalance={nativeTokenBalance}
                  ustWalletBalance={ustBalance}
                  maxDeposit={pool.maxDepositAmount}
                  minDeposit={pool.minDepositAmount}
                  contracts={contracts}
                  poolId={pool.pool_id}
                  onTransactionToggle={onTransactionToggle}
                />
              </Box>
            </div>
            <div className={styles.validator_table}>
              <ValidatorsTable validators={pool.validators} />
            </div>
          </div>
          <div className={styles.deposit_button}>
            <ButtonOutlined size="large" onClick={openModal}>
              Deposit
            </ButtonOutlined>
          </div>
          {bottomModal && (
            <BottomModal open={bottomModal} onClose={closeModal}>
              <div className={styles.form_modal}>
                <Typography variant="h2" fontWeight="bold">
                  Deposit
                </Typography>
                <SPPoolDepositForm
                  walletBalance={nativeTokenBalance}
                  ustWalletBalance={ustBalance}
                  maxDeposit={pool.maxDepositAmount}
                  minDeposit={pool.minDepositAmount}
                  contracts={contracts}
                  poolId={pool.pool_id}
                  onTransactionToggle={onTransactionToggle}
                />
              </div>
            </BottomModal>
          )}
        </div>
      )}
    </Box>
  );
};

export default SPoolTableRowHead;
