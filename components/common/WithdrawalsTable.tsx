import { FC } from "react";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import moment from "moment";
import useClipboard from "react-use-clipboard";
import { nativeTokenFormatter } from "../../utils/CurrencyHelper";
import { NATIVE_TOKEN_LABEL, tooltips } from "../../constants/constants";
import { sortWithdrawDate } from "../../utils/helper";

interface Props {
  undelegations: Undelegation[];
  primaryWalletAddress: string;
  handleWithdraw: (undelegation: Undelegation) => void;
  protocolFee: number;
}

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

const WithdrawalsTable: FC<Props> = ({
  handleWithdraw,
  primaryWalletAddress,
  undelegations = [],
  protocolFee = 0,
}) => {
  const [isCopied, setCopied] = useClipboard(primaryWalletAddress, {
    successDuration: 1000 * 6,
  });

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <p className="withdrawalHeader">Withdrawals</p>
          <p className="withdrawalDescription"></p>
        </Grid>
        <Grid item xs={12}>
          <div className="withdrawalCard">
            {undelegations && undelegations.length > 0 ? (
              <TableContainer className="withdrawalTable">
                <Table aria-label="simple table">
                  <TableHead className="withdrawalTableHeader">
                    <TableRow>
                      <TableCell
                        align="left"
                        className="withdrawalTableHeaderText"
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        align="left"
                        className="withdrawalTableHeaderText"
                      >
                        <span className="withdrawalTableText">
                          Release Time
                        </span>
                      </TableCell>
                      <TableCell
                        align="left"
                        className="withdrawalTableHeaderText"
                        colSpan={4}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="withdrawalTableBody">
                    {undelegations.length > 0 &&
                      sortWithdrawDate(
                        undelegations,
                        (obj) => obj.est_release_time
                      ).map((undelegation) => (
                        <TableRow
                          key={undelegation.batch_id}
                          style={{ borderBottom: "none" }}
                        >
                          <TableCell
                            align="left"
                            className="withdrawalTableBodyText"
                          >
                            {undelegation.token_amount
                              ? nativeTokenFormatter(
                                  Number(undelegation.token_amount) *
                                    Number(undelegation.undelegation_er) *
                                    Number(
                                      undelegation.unbonding_slashing_ratio
                                    )
                                )
                              : "0"}
                            <span className="withdrawalTableBodyTextSmall">
                              {NATIVE_TOKEN_LABEL}
                            </span>
                          </TableCell>
                          {undelegation.est_release_time ? (
                            <TableCell
                              align="left"
                              className="withdrawalTableBodyText"
                            >
                              {moment
                                .unix(
                                  Number(undelegation.est_release_time) /
                                    1000000000
                                )
                                .add(15, "minutes")
                                .format("lll")}
                            </TableCell>
                          ) : (
                            <TableCell
                              align="left"
                              className="withdrawalTableBodyText"
                            >
                              Undelegation requires 21-24 days.
                              <span>
                                <Tooltip
                                  title={tooltips.withdrawals}
                                  classes={{
                                    tooltip: "tooltip",
                                    arrow: "arrow",
                                  }}
                                  placement={"bottom"}
                                  arrow
                                >
                                  <InfoOutlined className="withdrawalInfoIcon" />
                                </Tooltip>
                              </span>
                            </TableCell>
                          )}

                          <TableCell
                            align="right"
                            colSpan={4}
                            className="withdrawalTableBodyText"
                          >
                            <div className="withdrawalBodyButtonWrapper">
                              <Button
                                className="withdrawalBodyButton"
                                disabled={!undelegation.reconciled}
                                disableRipple
                                disableTouchRipple
                                disableFocusRipple
                                onClick={() => handleWithdraw(undelegation)}
                              >
                                Withdraw
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
        </Grid>
      </Grid>
    </>
  );
};

export default WithdrawalsTable;
