import { tooltips } from "@constants/constants";
import { WITHDRAW_PROTOCOL } from "@constants/queriesKey";
import { useAppContext } from "@libs/appContext";
import { InfoOutlined } from "@material-ui/icons";
import LSPWithdrawFundsModal from "@molecules/WithdrawModals/LSPWithdrawFundsModal";
import { lunaFormatter } from "@utils/CurrencyHelper";
import { Box, Loader, Button, Typography } from "../../atoms";
import { config } from "../../../config/config";
import { useState } from "react";
import { useQuery } from "react-query";
import styles from "./LPPoolsWithdraw.module.scss";
import classNames from "classnames";
import { sortWithdrawDate } from "@utils/helper";
import moment from "moment";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";

export interface Undelegation {
  create_time: string;
  est_release_time: string | null;
  reconciled: boolean;
  undelegated_tokens: string;
  undelegation_er: string;
  unbonding_slashing_ratio?: string;
  undelegated_stake?: string;
  batch_id: number;
  token_amount: string;
}

const { liquidStaking: contractAddress } = config.contractAddresses;

interface Props {
  undelegations?: Undelegation[];
  handleWithdraw?: (undelegation: Undelegation) => void;
  isLoading: boolean;
  refetchQuery: () => void;
}

type ModalProps = {
  open: boolean;
  contractAddress: string;
  amount: number;
  protocolFee: number;
  undelegationBatchId: number;
};

const defaultModalState = {
  open: false,
  amount: 0,
  contractAddress: "",
  protocolFee: 0,
  undelegationBatchId: 0,
};

function LPPoolsWithdraw({
  undelegations = [],
  isLoading,
  refetchQuery,
}: Props) {
  const { terra } = useAppContext();

  const [modal, setModal] = useState<ModalProps>(defaultModalState);

  const [withdrawProtocolFee, setWithdrawProtocol] = useState<number>(0);

  const handleInitialization = async () => {
    const contractConfig = await terra.wasm.contractQuery(contractAddress, {
      config: {},
    });

    return Number(contractConfig?.config?.protocol_withdraw_fee ?? 0);
  };

  useQuery(WITHDRAW_PROTOCOL, handleInitialization, {
    onSuccess: (res: number) => {
      setWithdrawProtocol(res);
    },
    refetchOnWindowFocus: false,
  });

  const handleModalClose = () => {
    refetchQuery();
    setModal(defaultModalState);
  };

  const handleWithdraw = async (undelegation: any) => {
    const amount =
      Number(undelegation.token_amount) *
      Number(undelegation.undelegation_er) *
      Number(undelegation.unbonding_slashing_ratio);

    setModal({
      open: true,
      contractAddress,
      amount,
      protocolFee: withdrawProtocolFee,
      undelegationBatchId: undelegation.batch_id as number,
    });
  };

  return (
    <Box className={styles.root} noPadding>
      <div>
        {isLoading ? (
          <Loader position={"center"} />
        ) : undelegations.length ? (
          <table aria-label="simple table" className={styles.table}>
            <thead>
              <tr>
                <th>
                  <Typography color="textSecondary" className="text-left">
                    Amount
                  </Typography>
                </th>
                <th>
                  <Typography
                    color="textSecondary"
                    className="text-right md:text-left"
                  >
                    Release Time
                  </Typography>
                </th>
                <th className={styles.desktop_td_button} />
              </tr>
            </thead>
            <tbody>
              {undelegations.length > 0 &&
                sortWithdrawDate(
                  undelegations,
                  (obj) => obj.est_release_time
                ).map((undelegation) => (
                  <>
                    <tr key={undelegation.batch_id}>
                      <td className={styles.td}>
                        <div className={styles.amount_wrap}>
                          <Typography>
                            {undelegation.token_amount
                              ? lunaFormatter(
                                  Number(undelegation.token_amount) *
                                    Number(undelegation.undelegation_er) *
                                    Number(
                                      undelegation.unbonding_slashing_ratio
                                    )
                                )
                              : "0"}
                          </Typography>
                          <Typography variant="body2">LUNA</Typography>
                        </div>
                      </td>
                      <td className={classNames(styles.td, styles.time)}>
                        {undelegation.est_release_time ? (
                          <Typography variant="body1">
                            {moment
                              .unix(
                                Number(undelegation.est_release_time) /
                                  1000000000
                              )
                              .add(15, "minutes")
                              .format("lll")}
                          </Typography>
                        ) : (
                          <Typography variant="body1">
                            Undelegation requires 21-24 days.
                            <SDTooltip
                              content={tooltips.withdrawals}
                              fontSize="small"
                              className="text-white ml-1"
                            />
                          </Typography>
                        )}
                      </td>

                      <td className={styles.desktop_td_button}>
                        <Button
                          disabled={!undelegation.reconciled}
                          size="small"
                          onClick={() => handleWithdraw(undelegation)}
                        >
                          Withdraw
                        </Button>
                      </td>
                    </tr>
                    <tr className={styles.moble_tr}>
                      <td></td>
                      <td className={styles.mobile_td_button}>
                        <Button
                          disabled={!undelegation.reconciled}
                          size="small"
                          onClick={() => handleWithdraw(undelegation)}
                        >
                          Withdraw
                        </Button>
                      </td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        ) : (
          <div>
            <div className="welcome-content">
              <div className="zeroState">
                <div>
                  <InfoOutlined className="infoIcon" />
                </div>
                <div className="zeroStateContent">
                  <p className="header">
                    Hey, you haven’t made any withdrawals yet!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/*{modalComponent}*/}
      <LSPWithdrawFundsModal onClose={handleModalClose} {...modal} />
    </Box>
  );
}

export default LPPoolsWithdraw;
