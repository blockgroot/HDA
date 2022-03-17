import SDTooltip from "@atoms/SDTooltip/SDTooltip";
import { LIQUID_NATIVE_TOKEN_LABEL, NATIVE_TOKEN_LABEL, tooltips } from "@constants/constants";
import { defaultWithdrawProps } from "@constants/sp-portfolio";
import { Tooltip } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import WithdrawFundsDialog from "@molecules/SPWithdrawModal/SPWithdrawModal";
import { SPWithdrawModalProps } from "@types_/portfolio";
import { getContractByName } from "@utils/contractFilters";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import { sortWithdrawDate } from "@utils/helper";
import classNames from "classnames";
import { useWithdrawRewardsDialog } from "dialogs/useWithdrawRewardsDialog";
import moment from "moment";
import React, { useState } from "react";
import { Box, Button, Typography } from "../../atoms";
import PortfolioNoItem from "../../molecules/PortfolioNoItem/PortfolioNoItem";
import styles from "./SPPortfolioMHWithdrawal.module.scss";

interface Props {
  contracts: any;
  poolsUndelegations: any;
  delegatorConfig: any;
  gasPrices: any;
  rewardsUndelegations: any;
}

type ModalState = Omit<SPWithdrawModalProps, "onClose">;

function SPPortfolioMHWithdrawal({
  contracts,
  poolsUndelegations,
  rewardsUndelegations,
}: Props) {
  const [modal, setModal] = useState<ModalState>(defaultWithdrawProps);
  const [openWithdrawRewardsDialog, withdrawRewardsDialogElement] =
    useWithdrawRewardsDialog();

  const openModal = (props: ModalState) => {
    setModal(props);
  };

  const closeModal = () => {
    setModal(defaultWithdrawProps);
  };

  return (
    <div className="myPortfolioContainer">
      <Typography variant={"h2"} fontWeight={"bold"} className={"mb-4"}>
        Withdrawals
      </Typography>
      <Box className={styles.box}>
        {(poolsUndelegations && poolsUndelegations.length) ||
        (rewardsUndelegations && rewardsUndelegations.length) ? (
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.row}>
                <th>Type</th>
                <th>Amount</th>
                <th className={styles.desktop_only}>Release Time</th>
                <th className={styles.desktop_only} />
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {poolsUndelegations.length > 0 &&
                sortWithdrawDate(
                  poolsUndelegations,
                  (obj) => obj.est_release_time
                ).map((undelegation: any) => (
                  <>
                    <tr key={undelegation.id} className={styles.row}>
                      <td>{undelegation.pool_name}</td>
                      <td>
                        {undelegation.undelegationInfo
                          .computed_undelegation_amount
                          ? nativeTokenFormatter(
                              undelegation.undelegationInfo
                                .computed_undelegation_amount
                            )
                          : nativeTokenFormatter(undelegation.amount)}{" "}
                        <Typography variant={"body2"} className={"inline"}>
                          {NATIVE_TOKEN_LABEL}
                        </Typography>
                      </td>
                      <td className={styles.desktop_only}>
                        {undelegation.undelegationInfo.est_release_time ? (
                          <>
                            {moment
                              .unix(
                                undelegation.undelegationInfo.est_release_time /
                                  1000000000
                              )
                              .format("lll")}
                          </>
                        ) : (
                          <>
                            Undelegations take 21 to 24 days.
                            <SDTooltip
                              content={tooltips.withdrawals}
                              className={"text-white ml-2"}
                            />
                          </>
                        )}
                      </td>
                      <td className={styles.desktop_only}>
                        <div>
                          <Button
                            size={"small"}
                            disabled={!undelegation.undelegationInfo.reconciled}
                            onClick={() => {
                              openModal({
                                open: true,
                                poolsContractAddress: getContractByName(
                                  contracts,
                                  "Pools"
                                ),
                                title: undelegation.pool_name,
                                amount: undelegation.undelegationInfo
                                  .computed_undelegation_amount
                                  ? undelegation.undelegationInfo
                                      .computed_undelegation_amount
                                  : undelegation.amount,
                                poolId: undelegation.pool_id,
                                undelegationId: undelegation.id as number,
                                undelegationBatchId:
                                  undelegation.batch_id as number,
                              });
                            }}
                          >
                            Withdraw
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr
                      className={classNames(
                        styles.mobile_only,
                        styles.mobile_withdraw_time
                      )}
                    >
                      <td colSpan={2}>
                        {undelegation.undelegationInfo.est_release_time ? (
                          <>
                            {moment
                              .unix(
                                undelegation.undelegationInfo.est_release_time /
                                  1000000000
                              )
                              .format("lll")}
                          </>
                        ) : (
                          <>
                            Undelegations take 21 to 24 days.
                            <SDTooltip
                              content={tooltips.withdrawals}
                              className={"text-white ml-1"}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                    <tr
                      className={classNames(
                        styles.mobile_only,
                        styles.mobile_button_tr
                      )}
                    >
                      <div>
                        <Button
                          size={"small"}
                          disabled={!undelegation.undelegationInfo.reconciled}
                          onClick={() => {
                            openModal({
                              open: true,
                              poolsContractAddress: getContractByName(
                                contracts,
                                "Pools"
                              ),
                              title: undelegation.pool_name,
                              amount: undelegation.undelegationInfo
                                .computed_undelegation_amount
                                ? undelegation.undelegationInfo
                                    .computed_undelegation_amount
                                : undelegation.amount,
                              poolId: undelegation.pool_id,
                              undelegationId: undelegation.id as number,
                              undelegationBatchId:
                                undelegation.batch_id as number,
                            });
                          }}
                        >
                          Withdraw
                        </Button>
                      </div>
                    </tr>
                  </>
                ))}
            </tbody>
            <tbody className={styles.tbody}>
              {rewardsUndelegations.length > 0 &&
                sortWithdrawDate(
                  rewardsUndelegations,
                  (obj) => obj.withdrawal_time
                ).map((undelegation: any, index) => (
                  <>
                    <tr key={undelegation.id} className={styles.row}>
                      <td className={styles.label}>
                        {undelegation.strategy_id === 1
                          ? "Auto Compounding"
                          : "Retain Rewards"}
                      </td>
                      <td>
                        {undelegation.undelegationInfo
                          .computed_undelegation_amount
                          ? nativeTokenFormatter(
                              undelegation.undelegationInfo
                                .computed_undelegation_amount
                            )
                          : nativeTokenFormatter(undelegation.amount)}{" "}
                        <Typography variant={"body2"} className={"inline"}>
                          {LIQUID_NATIVE_TOKEN_LABEL}
                        </Typography>
                      </td>
                      <td className={styles.desktop_only}>
                        {undelegation.undelegationInfo.withdrawal_time ? (
                          <>
                            {moment
                              .unix(
                                undelegation.undelegationInfo.withdrawal_time /
                                  1000000000
                              )
                              .format("lll")}
                          </>
                        ) : (
                          <>
                            Undelegations take 21 to 24 days.
                            <SDTooltip
                              content={tooltips.withdrawals}
                              className={"text-white ml-2"}
                            />
                          </>
                        )}
                      </td>
                      <td className={styles.desktop_only}>
                        <div>
                          <Button
                            size={"small"}
                            disabled={
                              !undelegation.undelegationInfo.withdrawal_time ||
                              moment().isBefore(
                                moment
                                  .unix(
                                    undelegation.undelegationInfo
                                      .withdrawal_time / 1000000000
                                  )
                                  .format("lll")
                              )
                            }
                            onClick={() => {
                              openWithdrawRewardsDialog({
                                sccContractAddress: getContractByName(
                                  contracts,
                                  "scc"
                                ),
                                title:
                                  undelegation.strategy_id === 1
                                    ? "Auto Compounding"
                                    : "Retain Rewards",
                                undelegationRecordInfo: undelegation,
                              });
                            }}
                          >
                            Withdraw
                          </Button>
                        </div>
                      </td>
                    </tr>

                    <tr
                      className={classNames(
                        styles.mobile_only,
                        styles.mobile_withdraw_time
                      )}
                    >
                      <td colSpan={2}>
                        {undelegation.undelegationInfo.withdrawal_time ? (
                          <>
                            {moment
                              .unix(
                                undelegation.undelegationInfo.withdrawal_time /
                                  1000000000
                              )
                              .format("lll")}
                          </>
                        ) : (
                          <>
                            Undelegations take 21 to 24 days.
                            <SDTooltip
                              content={tooltips.withdrawals}
                              className={"text-white ml-2"}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                    <tr
                      className={classNames(styles.mobile_only, {
                        [styles.mobile_button_tr]:
                          index < rewardsUndelegations.length - 1,
                      })}
                    >
                      <div>
                        <Button
                          size={"small"}
                          disabled={
                            !undelegation.undelegationInfo.withdrawal_time ||
                            moment().isBefore(
                              moment
                                .unix(
                                  undelegation.undelegationInfo
                                    .withdrawal_time / 1000000000
                                )
                                .format("lll")
                            )
                          }
                          onClick={() => {
                            openWithdrawRewardsDialog({
                              sccContractAddress: getContractByName(
                                contracts,
                                "scc"
                              ),
                              title:
                                undelegation.strategy_id === 1
                                  ? "Auto Compounding"
                                  : "Retain Rewards",
                              undelegationRecordInfo: undelegation,
                            });
                          }}
                        >
                          Withdraw
                        </Button>
                      </div>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="mx-auto">
            <PortfolioNoItem type={"withdrawal"} />
          </div>
        )}
      </Box>
      {modal.open && <WithdrawFundsDialog onClose={closeModal} {...modal} />}
      {withdrawRewardsDialogElement}
    </div>
  );
}

export default SPPortfolioMHWithdrawal;
