import styles from "./LSPoolsFormLaToLx.module.scss";
import { Icon, Typography } from "../../atoms";
import { NATIVE_TOKEN_LABEL, precision } from "@constants/constants";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";
import { ButtonOutlined } from "@atoms/Button/Button";
import moment from "moment";
import { UndelegateData } from "hooks/useWithdrawals";
import WithdrawModal from "@molecules/WithdrawModal/WithdrawModal";
import { useState } from "react";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import { Tab, Tabs } from "@material-ui/core";
import axios from "axios";
import { getAnalytics, logEvent } from "firebase/analytics";
import { useEffect } from "react";
import LSEmptyClaim from "./LSEmptyClaim";

type LSPoolsFormClaimProps = {
  undelegateData: UndelegateData[];
  walletBalance: number;
  handleClaim: () => void;
};

export default function LSPoolsFormClaim(
  props: LSPoolsFormClaimProps
): JSX.Element {
  const [claim, setClaim] = useState<UndelegateData | undefined>(undefined);
  const [tab, setTab] = useState<number>(0);
  const { undelegateData, handleClaim, walletBalance } = props;
  const openWithDrawModal = (claim: UndelegateData) => {
    //handleClaim(index);
    const analytics = getAnalytics();
    logEvent(analytics, "withdraw_click", { amount: claim.amount });
    setClaim(claim);
  };
  const [timestamp, setTimestamp] = useState<number>(
    Math.floor(new Date().getTime() / 1000)
  );

  const getTimeStamp = async () => {
    try {
      const response: any = await axios.get(`/api/timestamp`);
      if (response?.data) {
        setTimestamp(response.data.timestamp);
      }
    } catch (err) {
      // Handle Error Here
      console.error("error", err);
    }
  };

  useEffect(() => {
    getTimeStamp();
  }, []);

  const closeModal = () => {
    handleClaim();
    setClaim(undefined);
  };
  return (
    <div className={styles.root__claim}>
      {undelegateData.length === 0 ? (
        <>
          <div className={`${styles.info_block} flex flex-row`}>
            <div className="flex flex-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="6" cy="6" r="6" fill="#8C8C8C" />
                <path
                  d="M5.6275 5.0597H6.565V9.20996H5.6275V5.0597ZM6.1 4.37576C5.93 4.37576 5.7875 4.32136 5.6725 4.21255C5.5575 4.09856 5.5 3.95867 5.5 3.79286C5.5 3.62706 5.5575 3.48975 5.6725 3.38095C5.7875 3.26696 5.93 3.20996 6.1 3.20996C6.27 3.20996 6.4125 3.26437 6.5275 3.37317C6.6425 3.4768 6.7 3.60892 6.7 3.76955C6.7 3.94053 6.6425 4.08561 6.5275 4.20478C6.4175 4.31877 6.275 4.37576 6.1 4.37576Z"
                  fill="#111111"
                />
              </svg>
            </div>
            <Typography variant={"caption1"}>
              You will be able to claim your rewards after the Unstake request
              has been processed. To Unstake your amount go to Unstake Tab
            </Typography>
          </div>

          <div
            className={` ${styles.no_claims} flex flex-center flex-column height-full`}
          >
            <svg
              width="42"
              height="42"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.25247 15C12.2405 15 15.4734 11.866 15.4734 8C15.4734 4.13401 12.2405 1 8.25247 1C4.26447 1 1.03156 4.13401 1.03156 8C1.03156 11.866 4.26447 15 8.25247 15ZM8.25247 16C12.8102 16 16.5049 12.4183 16.5049 8C16.5049 3.58172 12.8102 0 8.25247 0C3.69475 0 0 3.58172 0 8C0 12.4183 3.69475 16 8.25247 16Z"
                fill="#3E3E3E"
              />
              <path
                d="M7.74006 6.65995H9.02951V11.9999H7.74006V6.65995ZM8.38994 5.77995C8.15612 5.77995 7.96013 5.70995 7.80196 5.56995C7.64378 5.42328 7.5647 5.24328 7.5647 5.02995C7.5647 4.81661 7.64378 4.63995 7.80196 4.49995C7.96013 4.35328 8.15612 4.27995 8.38994 4.27995C8.62376 4.27995 8.81976 4.34995 8.97793 4.48995C9.1361 4.62328 9.21519 4.79328 9.21519 4.99995C9.21519 5.21995 9.1361 5.40661 8.97793 5.55995C8.82664 5.70661 8.63064 5.77995 8.38994 5.77995Z"
                fill="#3E3E3E"
              />
            </svg>
            <Typography variant={"body1"} fontWeight={"normal"}>
              You don’t have any claims yet!
            </Typography>
          </div>
        </>
      ) : (
        <>
          <div className={`grid_tabs`}>
            <Tabs
              onChange={(e, tab) => setTab(tab)}
              value={tab}
              indicatorColor={"secondary"}
            >
              <Tab label={"Active"} value={0} />
              <Tab label={"Complete"} value={1} />
            </Tabs>
          </div>
          <div className={styles.claim_grid}>
            {tab === 0 &&
              undelegateData.filter((s) => !s.isWithDrawn).length === 0 && (
                <LSEmptyClaim
                  message="To withdraw your HBAR, please Unstake first"
                  showNoClaim={true}
                />
              )}
            {tab === 0 &&
              undelegateData.filter((s) => !s.isWithDrawn).length > 0 && (
                <>
                  <div className={styles.claim_grid__row}>
                    <div className={styles.claim_grid__row__header}>
                      <Typography variant={"caption1"}>Amount</Typography>
                    </div>
                    <div className={styles.claim_grid__row__header2}>
                      <Typography variant={"caption1"}>
                        Exchange Rate
                      </Typography>
                      <SDTooltip
                        content={
                          "The HBARX Exchange Rate at the time of unstaking."
                        }
                        className="text-white ml-1"
                        fontSize="small"
                      />
                    </div>
                    <div
                      className={`${styles.claim_grid__row__header} ${styles.claim_grid__row__withdrawl_column_header}`}
                    >
                      <Typography variant={"caption1"}>Withdrawals </Typography>
                      <SDTooltip
                        content={
                          "HBARs will be available for withdrawal after the unbonding period."
                        }
                        className="text-white ml-1"
                        fontSize="small"
                      />
                    </div>
                  </div>
                  {undelegateData
                    .filter((s) => !s.isWithDrawn)
                    .map((claim, key) => (
                      <div key={key} className={styles.claim_grid__row}>
                        <div className={styles.claim_grid__row__item}>
                          <Typography variant={"caption1"}>
                            {nativeTokenFormatter(claim.amount)}{" "}
                            {NATIVE_TOKEN_LABEL}
                          </Typography>
                        </div>

                        <div className={styles.claim_grid__row__item2}>
                          <Typography variant={"caption1"}>
                            {claim.exchangeRate.toFixed(precision)}
                          </Typography>
                        </div>
                        {!claim.isWithDrawn && (
                          <div
                            className={`${styles.claim_grid__row__item} ${styles.claim_grid__row__withdrawl_column}`}
                          >
                            {claim.time > timestamp * 1000 ? (
                              <Typography
                                variant={"caption1"}
                                className={`${styles.claim_grid__row__item__text}`}
                              >
                                Available on {""}
                                <Typography
                                  variant={"caption1"}
                                  className={"font-weight-bold"}
                                >
                                  {moment(claim.time)
                                    .utc()
                                    .local()
                                    .format("DD MMM'YY, hh:mm A")}
                                </Typography>
                              </Typography>
                            ) : (
                              <ButtonOutlined
                                className="text-white px-4 ml-4"
                                size="normal"
                                onClick={(e) => {
                                  //handleClaim(claim.index);
                                  openWithDrawModal(claim);
                                }}
                              >
                                <Typography
                                  variant={"body2"}
                                  fontWeight={"bold"}
                                  className={"mr-1"}
                                >
                                  Withdraw
                                </Typography>
                              </ButtonOutlined>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </>
              )}
            {tab === 1 &&
              undelegateData.filter((s) => s.isWithDrawn).length === 0 && (
                <LSEmptyClaim
                  message="You have not made any withdrawls yet"
                  showNoClaim={false}
                />
              )}
            {tab === 1 &&
              undelegateData.filter((s) => s.isWithDrawn).length > 0 && (
                <>
                  <div className={styles.claim_grid__row}>
                    <div className={styles.claim_grid__row__header}>
                      <Typography variant={"caption1"}>Amount</Typography>
                    </div>
                    <div className={styles.claim_grid__row__header2}>
                      <Typography variant={"caption1"}>
                        Exchange Rate
                      </Typography>
                      <SDTooltip
                        content={
                          "The HBARX Exchange Rate at the time of unstaking."
                        }
                        className="text-white ml-1"
                        fontSize="small"
                      />
                    </div>
                    <div
                      className={`${styles.claim_grid__row__header} ${styles.claim_grid__row__withdrawl_column_header}`}
                    >
                      <Typography variant={"caption1"}>Withdrew On</Typography>
                    </div>
                  </div>
                  {undelegateData
                    .filter((s) => s.isWithDrawn)
                    .reverse()
                    .map((claim, key) => (
                      <div key={key} className={styles.claim_grid__row}>
                        <div className={styles.claim_grid__row__item}>
                          <Typography variant={"caption1"}>
                            {nativeTokenFormatter(claim.amount)}{" "}
                            {NATIVE_TOKEN_LABEL}
                          </Typography>
                        </div>
                        <div className={styles.claim_grid__row__item2}>
                          <Typography variant={"caption1"}>
                            {claim.exchangeRate.toFixed(precision)}
                          </Typography>
                        </div>
                        <div className={styles.claim_grid__row__item3}>
                          <Typography variant={"caption1"}>
                            {moment(claim.time)
                              .utc()
                              .local()
                              .format("DD MMM'YY, hh:mm A")}
                            &nbsp;&nbsp;
                          </Typography>
                          <Icon
                            name="check_success"
                            width={14}
                            height={14}
                            className="margin-left-2"
                            alt=""
                          />
                        </div>
                      </div>
                    ))}
                </>
              )}
          </div>
        </>
      )}
      <WithdrawModal
        walletBalance={walletBalance}
        modal={!!claim}
        claim={claim}
        closeModal={closeModal}
      ></WithdrawModal>
    </div>
  );
}
