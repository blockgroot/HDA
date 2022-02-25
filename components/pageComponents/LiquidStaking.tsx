import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  demicrofy,
  formatUST,
  formatUSTWithPostfixUnits,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from "@anchor-protocol/notation";

import { WalletStatus } from "@terra-money/wallet-provider";
import { InfoOutlined } from "@material-ui/icons";

import { BorderButton } from "@terra-dev/neumorphism-ui/components/BorderButton";
import { Grid, InputAdornment, Tooltip } from "@material-ui/core";
import Loader from "../common/Loader";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import classnames from "classnames";
import { config } from "../../config/config";
import { getLunaPrice } from "../../services/currency";
import WithdrawalsTable, { Undelegation } from "../common/WithdrawalsTable";
import SuccessAnimation from "../common/SuccessAnimation";
import {
  LUNA_MULTIPLIER,
  PAGE_LOADER_TEXT,
  tokenLabel,
  urls,
  ustFee,
  ustFeeStaking,
} from "../../constants/constants";

import withMediaQuery from "../../media_query";
import LiquidTokenStrategiesInfo from "../common/LiquidTokenStrategiesInfo";
import { lunaFormatter } from "../../utils/CurrencyHelper";
import WelcomeScreenPoolLiquidStaking from "../common/WelcomeScreenPoolLiquidStaking";
import InfoPageMobile from "../common/InfoPageMobile";
import { useLiquidStakingWithdrawFundsDialog } from "../../dialogs/useLiquidStakingWithdrawFundsDialog";
import moment from "moment";

type Tab = "stake" | "unstake";

type WalletFunds = {
  uusd: number;
  uluna: number;
};

type TVL = {
  uluna: number;
  valueInUSD: number;
  exchangeRate: number;
};

type Props = {
  walletFunds: WalletFunds;
  wallet?: any;
  terra?: any;
  mediaQuery: boolean;
  primaryWalletAddress: string;
  fetchWalletFunds?: any;
  walletStatus?: any;
  toggleConnectWallet?: any;
};

const {
  liquidStaking: contractAddress,
  cw20: tokenAddress,
  lpcw20: lpCw20Address,
  lpPool: poolAddress,
} = config.contractAddresses;

type TokenProps = {
  label: string;
  value: string;
};

type Batch = {
  batch_id: number;
  token_amount: string;
};

type DepositLimit = {
  min: number;
  max: number;
};

const TokenBalance: FC<TokenProps> = ({ label, value }) => (
  <div className="flex layout-align-start-end">
    <span
      className={label === "LUNA" ? "flex value gradientText" : "flex value"}
    >
      {value}
    </span>
    <span className="denom-value">{label === "LUNA" ? label : null}</span>
  </div>
);

const LiquidStaking: FC<Props> = ({
  walletFunds,
  wallet,
  terra,
  mediaQuery,
  primaryWalletAddress,
  fetchWalletFunds,
  walletStatus,
  toggleConnectWallet,
}) => {
  const [
    openLiquidStakingWithdrawFundsDialog,
    liquidStakingWithdrawFundsDialogElement,
  ] = useLiquidStakingWithdrawFundsDialog();

  const [isDeviceMobile, setIsDeviceMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("stake");
  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const [spinner, setSpinner] = useState<boolean>(false);
  const [validationMsg, setValidationMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [undelegations, setUndelegations] = useState<Undelegation[]>([]);
  const [withdrawProtocolFee, setWithdrawProtocol] = useState<number>(0);
  const [depositLimit, setDepositLimit] = useState<DepositLimit>({
    min: 0,
    max: 0,
  });
  const [tvl, setTvl] = useState<TVL>({
    uluna: 0,
    valueInUSD: 0,
    exchangeRate: 0,
  });
  const [lunaToken, setLunaToken] = useState(0);
  const [lunaXToken, setLunaXToken] = useState(0);
  const [holdings, setHoldings] = useState<number>(0);
  const [availableAmount, setAvailableAmount] = useState<number>(
    walletFunds?.uluna ?? 0
  );
  const [inputAmount, setInputAmount] = useState<string>("");
  const [percentageShortcut, setPercentageShortcut] = useState<number>(0);
  const isStakeTab = activeTab === "stake";
  const isWalletConnected =
    !!primaryWalletAddress && primaryWalletAddress !== "";
  const upperlimit = isStakeTab
    ? Math.min(availableAmount, depositLimit.max)
    : availableAmount;
  const isValidAmount =
    inputAmount &&
    Number(inputAmount) * LUNA_MULTIPLIER >= depositLimit.min &&
    Number(inputAmount) * LUNA_MULTIPLIER <= upperlimit;
  const footerNote = isStakeTab
    ? `You can only deposit ${
        depositLimit.max / LUNA_MULTIPLIER ?? 100
      } LUNA as the Liquid Token is currently under audit.`
    : "Undelegation requires 21-24 days. You can immediately unlock Luna on LunaX <> Luna pool";
  const loadingMessage = spinner ? "Your transaction is in progress..." : null;

  useEffect(() => {
    if (mediaQuery !== isDeviceMobile) {
      setIsDeviceMobile(mediaQuery);
    }
  }, [mediaQuery]);

  useEffect(() => {
    setPercentageShortcut(0);
    setValidationMsg("");
    setInputAmount("");
  }, [activeTab]);

  useEffect(() => {
    if (isStakeTab) {
      setAvailableAmount(walletFunds?.uluna ?? 0);
    } else {
      setAvailableAmount(Number(holdings));
    }
  }, [activeTab, walletFunds, holdings]);

  useEffect(() => {
    refreshState();
  }, [primaryWalletAddress]);

  useEffect(() => {
    if (percentageShortcut) {
      const amount = (percentageShortcut * availableAmount) / 100;
      const limitAmount = amount > upperlimit ? upperlimit : amount;
      setInputAmount((limitAmount / LUNA_MULTIPLIER).toFixed(6));
    }
  }, [percentageShortcut, setInputAmount, availableAmount]);

  useEffect(() => {
    if (batches.length > 0) {
      getUserUndelegations(batches);
    } else {
      setPageLoader(false);
    }
  }, [batches]);

  const initialize = useCallback(async () => {
    const contractState = await terra.wasm.contractQuery(contractAddress, {
      state: {},
    });

    const contractConfig = await terra.wasm.contractQuery(contractAddress, {
      config: {},
    });

    const lunaPrice: any = await getLunaPrice();

    const totalStaked = Number(contractState.state.total_staked ?? 0);
    const exchangeRate = Number(contractState.state.exchange_rate ?? 0);
    const usdRate = Number(lunaPrice.amount ?? 0);
    const min = Number(contractConfig?.config?.min_deposit ?? 0);
    const max = Number(contractConfig?.config?.max_deposit ?? 0);
    const protocolFee = Number(
      contractConfig?.config?.protocol_withdraw_fee ?? 0
    );

    setTvl({
      uluna: totalStaked,
      valueInUSD: (totalStaked * usdRate) / LUNA_MULTIPLIER,
      exchangeRate,
    });
    setDepositLimit({ min, max });
    setWithdrawProtocol(protocolFee);
  }, []);

  const updateStakingAmount = (value: string) => {
    setPercentageShortcut(0);
    setInputAmount(value);
    setValidationMessageForStakingAmount(
      parseFloat(value),
      walletFunds,
      depositLimit.max,
      depositLimit.min
    );
  };

  function setValidationMessageForStakingAmount(
    depositAmount: number,
    funds: any,
    maxDepositAmount: number,
    minDepositAmount: number
  ) {
    const maxAmount = (availableAmount / LUNA_MULTIPLIER).toFixed(6);
    let ustWalletBalance =
      funds && funds.uusd && formatUSTWithPostfixUnits(demicrofy(funds.uusd));
    ustWalletBalance =
      ustWalletBalance && parseInt(ustWalletBalance.replaceAll(",", ""));

    if (depositAmount > parseFloat(maxAmount)) {
      setValidationMsg(
        isStakeTab
          ? `Deposit amount should be less than ${maxAmount} LUNA.`
          : `Unstake amount should be less than ${maxAmount} LUNA.`
      );
    } else if (depositAmount < lunaFormatter(minDepositAmount)) {
      setValidationMsg(
        `Deposit amount should be more than ${lunaFormatter(
          minDepositAmount
        )} LUNA`
      );
    } else {
      setValidationMsg("");
    }

    const feeInUst = isStakeTab ? ustFeeStaking : ustFee;
    if (ustWalletBalance < feeInUst || !ustWalletBalance) {
      setValidationMsg("Not enough UST for transaction fee");
    }
  }

  const fetchUserInfo = async () => {
    let userBalance = 0;
    let totalBalance = 0;
    let totalLuna = 0;
    let totalLunaX = 0;

    await Promise.all([
      terra.wasm
        .contractQuery(contractAddress, {
          get_user_info: {
            user_addr: primaryWalletAddress,
          },
        })
        .then((r: any) => {
          const tokens = Number(r.user_info.total_tokens ?? 0);
          setHoldings(tokens);
        }),
      terra.wasm
        .contractQuery(contractAddress, {
          get_user_undelegation_records: { user_addr: primaryWalletAddress },
        })
        .then((r: any[]) => {
          if (r?.length) {
            setBatches(r);
          }
        }),
      terra.wasm
        .contractQuery(lpCw20Address, {
          balance: { address: primaryWalletAddress },
        })
        .then((r: any) => {
          userBalance = lunaFormatter(parseFloat(r.balance));
        }),
      terra.wasm
        .contractQuery(lpCw20Address, {
          token_info: {},
        })
        .then((r: any) => {
          totalBalance = lunaFormatter(parseFloat(r.total_supply));
        }),
      terra.wasm
        .contractQuery(poolAddress, {
          pool: {},
        })
        .then((r: any) => {
          r.assets.forEach((asset: any) => {
            if (
              asset &&
              asset.info &&
              asset.info.token &&
              asset.info.token.contract_addr
            ) {
              totalLunaX = lunaFormatter(parseFloat(asset.amount));
            } else {
              totalLuna = lunaFormatter(parseFloat(asset.amount));
            }
          });
        }),
    ]);

    const lunaTokens = (userBalance * totalLuna) / totalBalance;
    const lunaXTokens = (userBalance * totalLunaX) / totalBalance;

    setLunaToken(lunaTokens);
    setLunaXToken(lunaXTokens);
  };

  const getUserUndelegations = async (batches: any) => {
    const undelegationRecords: Undelegation[] = [];
    await Promise.all(
      batches.map(async (batch: any) => {
        await terra.wasm
          .contractQuery(contractAddress, {
            batch_undelegation: {
              batch_id: batch.batch_id,
            },
          })
          .then((r: any) => {
            const record: Undelegation = r.batch;
            undelegationRecords.push({
              ...record,
              batch_id: batch.batch_id,
              token_amount: batch.token_amount,
            });
          });
      })
    );
    setUndelegations(
      undelegationRecords.sort((a, b) => {
        return (
          +new Date(
            moment.unix(Number(b.est_release_time) / 1000000000).format("lll")
          ) -
          +new Date(
            moment.unix(Number(a.est_release_time) / 1000000000).format("lll")
          )
        );
      })
    );

    setPageLoader(false);
  };

  const refreshState = async () => {
    setPageLoader(true);
    await initialize();
    if (primaryWalletAddress) {
      await fetchUserInfo();
      fetchWalletFunds(primaryWalletAddress);
      setPageLoader(false);
    }
  };

  const handleStake = useCallback(async (primaryWalletAddress, amount) => {
    try {
      setSpinner(true);

      const msg = new MsgExecuteContract(
        primaryWalletAddress,
        contractAddress,
        {
          deposit: {},
        },
        { uluna: (amount * LUNA_MULTIPLIER).toFixed() }
      );

      // const hash = hashTxBytes(msg);

      const txResult = await postTransaction(primaryWalletAddress, msg);

      if (!(!!txResult.result && !!txResult.result.txhash)) {
        throw Error("Failed to send transaction");
      }

      setInputAmount("");
      setSpinner(false);
      setTimeout(() => {
        fetchWalletFunds(primaryWalletAddress);
      }, 3000);
      setSuccessMessage(`Staking of ${amount} LUNA is successful!`);
    } catch (err) {
      setSpinner(false);
      console.error(err);
    }
  }, []);

  const handleUnstake = useCallback(async (primaryWalletAddress, amount) => {
    try {
      setSpinner(true);

      const msg = new MsgExecuteContract(primaryWalletAddress, tokenAddress, {
        send: {
          contract: contractAddress,
          amount: (amount * LUNA_MULTIPLIER).toFixed(),
          msg: Buffer.from(
            JSON.stringify({
              queue_undelegate: {},
            })
          ).toString("base64"),
        },
      });

      // const hash = hashTxBytes(msg);

      const txResult = await postTransaction(primaryWalletAddress, msg);

      if (!(!!txResult.result && !!txResult.result.txhash)) {
        throw Error("Failed to send transaction");
      }

      setInputAmount("");
      setSuccessMessage(`Unstaking of ${amount} LunaX is successful!`);
      setTimeout(() => {
        fetchWalletFunds(primaryWalletAddress);
      }, 3000);
      setSpinner(false);
    } catch (err) {
      setSpinner(false);
      console.error(err);
    }
  }, []);

  const handleWithdraw = async (undelegation: any) => {
    if (isWalletConnected) {
      openLiquidStakingWithdrawFundsDialog({
        primaryWalletAddress: primaryWalletAddress || "",
        contractAddress,
        wallet,
        amount:
          Number(undelegation.token_amount) *
          Number(undelegation.undelegation_er) *
          Number(undelegation.unbonding_slashing_ratio),
        protocolFee: withdrawProtocolFee,
        undelegationBatchId: undelegation.batch_id as number,
        refreshPage: handleSuccess,
        terra,
        walletFunds,
      });
    }
  };

  const handleAction = () => {
    if (isStakeTab) {
      handleStake(primaryWalletAddress, inputAmount);
    } else {
      handleUnstake(primaryWalletAddress, inputAmount);
    }
  };

  const handleSuccess = () => {
    setPageLoader(true);
    setTimeout(refreshState, 5000);
    setSuccessMessage("");
  };

  const postTransaction = async (
    walletAddress: string,
    msg: MsgExecuteContract
  ) => {
    if (terra && wallet) {
      const fee = await terra.tx.estimateFee(walletAddress, [msg]);
      const transaction = {
        msgs: [msg],
        memo: "STADER",
      };

      const feeInUst = isStakeTab ? ustFeeStaking : ustFee;
      if (fee?.gas) {
        // @ts-ignore
        transaction.fee = new StdFee(
          fee.gas,
          `${(feeInUst * 1000000).toFixed()}uusd`
        );
      }

      const result = await wallet.post(transaction);
      return result;
    } else {
      return {};
    }
  };

  const outputAmount = useMemo(() => {
    if (!inputAmount || !tvl.exchangeRate) {
      return "";
    }

    return isStakeTab
      ? (Number(inputAmount) / tvl.exchangeRate).toFixed(6)
      : (Number(inputAmount) * tvl.exchangeRate).toFixed(6);
  }, [inputAmount, isStakeTab]);

  if (isDeviceMobile) {
    return (
      <div style={{ margin: "0 20px" }}>
        <InfoPageMobile />
      </div>
    );
  }

  return (
    <div
      className={
        isDeviceMobile
          ? "layout-child-container-mobile"
          : "layout-child-container"
      }
    >
      {primaryWalletAddress || walletStatus === WalletStatus.INITIALIZING ? (
        pageLoader || walletStatus === WalletStatus.INITIALIZING ? (
          <div>
            <Loader
              classes={"loaderContainer loaderContainer60"}
              loaderText={PAGE_LOADER_TEXT}
            />
          </div>
        ) : isDeviceMobile ? (
          <div className="liquidStakeContainer">
            <InfoPageMobile />
          </div>
        ) : (
          <div className="liquidStakeContainer">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <div className="stats-header">
                  <div className="stats stats-header">
                    <div className="flex tvl stats-section">
                      <span className="stats-section-header">My LunaX</span>
                      <TokenBalance
                        label={tokenLabel}
                        value={(holdings / LUNA_MULTIPLIER).toFixed(6)}
                      />
                    </div>
                    <div className="stats-section stats-value">
                      <span className="stats-section-header text-center">
                        APY
                        <Tooltip
                          title={
                            "Average 48 hours APY including airdrops & autocompounding of rewards."
                          }
                          classes={{
                            tooltip: "tooltip",
                            arrow: "arrow",
                          }}
                          placement={"bottom-end"}
                          arrow
                        >
                          <InfoOutlined className="stast-info" />
                        </Tooltip>
                      </span>
                      11.07%
                    </div>
                    <div className="flex tvl stats-section">
                      <span className="stats-section-header">TVL</span>
                      <TokenBalance
                        label="LUNA"
                        value={formatUST(demicrofy(tvl.uluna)).split(".")[0]}
                      />
                      {/* <span className="usd">${formatAmount(tvl.valueInUSD)}</span> */}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={8}>
                <div className="stakeCardBorder">
                  <div className="toggleBackground">
                    <span
                      className={classnames("slider", {
                        toggleSlider: !isStakeTab,
                      })}
                    />
                    <span
                      className={classnames(
                        "flex",
                        "flex-center",
                        "tabToggle",
                        {
                          activeTab: isStakeTab,
                        }
                      )}
                      onClick={() => setActiveTab("stake")}
                    >
                      Stake
                    </span>
                    <span
                      className={classnames(
                        "flex",
                        "flex-center",
                        "tabToggle",
                        {
                          activeTab: !isStakeTab,
                        }
                      )}
                      onClick={() => setActiveTab("unstake")}
                    >
                      Unstake
                    </span>
                  </div>
                  <div className="stakeCard">
                    {loadingMessage ? (
                      <div className="loader-container flex flex-center">
                        <Loader />
                        <p>{loadingMessage}</p>
                      </div>
                    ) : (
                      successMessage && (
                        <div className="success-state flex flex-center">
                          <div className="success-gif">
                            <SuccessAnimation />
                          </div>
                        </div>
                      )
                    )}
                    <div className="stats-section stats-value">
                      <span className="stats-section-header text-center">
                        APY
                        <Tooltip
                          title={
                            "Average 48 hours APY including airdrops & autocompounding of rewards."
                          }
                          classes={{
                            tooltip: "tooltip",
                            arrow: "arrow",
                          }}
                          placement={"bottom-end"}
                          arrow
                        >
                          <InfoOutlined className="stast-info" />
                        </Tooltip>
                      </span>
                      8.95%
                    </div>
                    <div className="flex tvl stats-section">
                      <span className="stats-section-header">TVL</span>
                      <TokenBalance
                        label="LUNA"
                        value={formatUST(demicrofy(tvl.uluna)).split(".")[0]}
                      />
                      {/* <span className="usd">${formatAmount(tvl.valueInUSD)}</span> */}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={8}>
                <div className="stakeCardBorder">
                  <div className="toggleBackground">
                    <span
                      className={classnames("slider", {
                        toggleSlider: !isStakeTab,
                      })}
                    />
                    <span
                      className={classnames(
                        "flex",
                        "flex-center",
                        "tabToggle",
                        {
                          activeTab: isStakeTab,
                        }
                      )}
                      onClick={() => setActiveTab("stake")}
                    >
                      Stake
                    </span>
                    <span
                      className={classnames(
                        "flex",
                        "flex-center",
                        "tabToggle",
                        {
                          activeTab: !isStakeTab,
                        }
                      )}
                      onClick={() => setActiveTab("unstake")}
                    >
                      Unstake
                    </span>
                  </div>
                  <div className="stakeCard">
                    {loadingMessage ? (
                      <div className="loader-container flex flex-center">
                        <Loader />
                        <p>{loadingMessage}</p>
                      </div>
                    ) : successMessage ? (
                      <div className="success-state flex flex-center">
                        <div className="success-gif">
                          <SuccessAnimation />
                        </div>

                        <div className="successDetails">
                          <p className="successHeader">{successMessage}</p>
                        </div>

                        <div className="stakeButtonItem">
                          <BorderButton
                            className="stakeButton"
                            onClick={handleSuccess}
                          >
                            Done
                          </BorderButton>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex inputInfo">
                          <span className="availableAmount">
                            Available:{" "}
                            {(availableAmount / LUNA_MULTIPLIER).toFixed(6)}{" "}
                            {isStakeTab ? "LUNA" : tokenLabel}
                          </span>
                          <span className="exchange-rate">{`1 ${tokenLabel} = ${tvl.exchangeRate.toFixed(
                            6
                          )} LUNA`}</span>
                        </div>
                        <p className="validationMessage">{validationMsg}</p>
                        <div className="inputContainer">
                          <NumberInput
                            className="amountField"
                            value={inputAmount}
                            maxIntegerPoinsts={
                              LUNA_INPUT_MAXIMUM_INTEGER_POINTS
                            }
                            maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
                            label="Enter Amount"
                            onChange={({ target }) => {
                              updateStakingAmount(target.value);
                            }}
                            disabled={!availableAmount}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <span className="adornment">
                                    {isStakeTab ? "LUNA" : tokenLabel}
                                  </span>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                        <div className="inputContainer">
                          <NumberInput
                            className="amountField"
                            value={outputAmount}
                            maxIntegerPoinsts={
                              LUNA_INPUT_MAXIMUM_INTEGER_POINTS
                            }
                            maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
                            label="Output Amount"
                            disabled={!availableAmount}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <span className="adornment">
                                    {isStakeTab ? tokenLabel : "LUNA"}
                                  </span>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <span className="arrowDown">
                            <img src="/static/arrowDown.png" alt="arrow down" />
                          </span>
                        </div>
                        <div className="stake-percentage-container">
                          <div className="flex">
                            <div
                              className={
                                percentageShortcut === 25
                                  ? "stake-percentage-active"
                                  : "stake-percentage"
                              }
                            >
                              <span
                                className={"stake-percentage-item"}
                                onClick={() => setPercentageShortcut(25)}
                              >
                                25%
                              </span>
                            </div>
                            <div
                              className={
                                percentageShortcut === 50
                                  ? "stake-percentage-active"
                                  : "stake-percentage"
                              }
                            >
                              <span
                                className={"stake-percentage-item"}
                                onClick={() => setPercentageShortcut(50)}
                              >
                                50%
                              </span>
                            </div>
                            <div
                              className={
                                percentageShortcut === 75
                                  ? "stake-percentage-active"
                                  : "stake-percentage"
                              }
                            >
                              <span
                                className={"stake-percentage-item"}
                                onClick={() => setPercentageShortcut(75)}
                              >
                                75%
                              </span>
                            </div>
                            <div
                              className={
                                percentageShortcut === 100
                                  ? "stake-percentage-active"
                                  : "stake-percentage"
                              }
                            >
                              <span
                                className={"stake-percentage-item"}
                                onClick={() => setPercentageShortcut(100)}
                              >
                                Max
                              </span>
                            </div>
                          </div>
                          <div className="fees">
                            Transaction Fee:{" "}
                            {isStakeTab ? ustFeeStaking : ustFee} UST
                          </div>
                        </div>
                        <hr className="staking-divider" />
                        <div className="flex inputInfo">
                          {!isStakeTab ? (
                            <span className="availableAmount">
                              Unstaking takes 21-24 days to unlock Luna. Unlock
                              Luna instantly{" "}
                              <b>
                                <u>
                                  {" "}
                                  <a
                                    href={urls.terraSwapSwap}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    here
                                  </a>
                                </u>
                              </b>
                            </span>
                          ) : (
                            <span
                              className="availableAmount"
                              style={{ fontSize: "0px" }}
                            >
                              Stake With Stader
                            </span>
                          )}
                        </div>
                        <div className="stakeButtonItem">
                          <BorderButton
                            className="stakeButton"
                            onClick={handleAction}
                            disabled={
                              !isWalletConnected ||
                              !isValidAmount ||
                              (validationMsg && validationMsg !== "")
                            }
                          >
                            <span>{isStakeTab ? "Stake" : "Unstake"}</span>
                          </BorderButton>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <LiquidTokenStrategiesInfo
                  lunaTokens={lunaToken}
                  lunaXTokens={lunaXToken}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <WithdrawalsTable
                  undelegations={undelegations}
                  handleWithdraw={handleWithdraw}
                  primaryWalletAddress={primaryWalletAddress}
                  protocolFee={withdrawProtocolFee}
                />
              </Grid>
            </Grid>
            {liquidStakingWithdrawFundsDialogElement}
          </div>
        )
      ) : (
        <div className="VaultsContainer">
          <WelcomeScreenPoolLiquidStaking
            toggleConnectWallet={toggleConnectWallet}
          />
        </div>
      )}
    </div>
  );
};

export default withMediaQuery("(max-width:1024px)")(LiquidStaking);
