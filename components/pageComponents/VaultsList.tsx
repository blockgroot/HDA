import React, { useState, useEffect, useCallback } from "react";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from "@anchor-protocol/notation";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import axios from "axios";

import { Tooltip } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

import { config } from "../../config/config";
import {
  airdropsAPR,
  GAS_PRICES_URL,
  messageMemo,
  PAGE_LOADER_TEXT,
  tooltips,
  transactionsTypeMap,
  tvlCap,
  ustFeeStaking,
} from "../../constants/constants";

import { lunaFormatter } from "../../utils/CurrencyHelper";
import Loader from "../common/Loader";
import maintenanceIcon from "../../assets/svg/maintenance.svg";
import decentralizationIcon from "../../assets/svg/decentralization.svg";
import airdropsIcon from "../../assets/svg/airdrops.svg";
import slashingIcon from "../../assets/svg/slashing.svg";
import decentralizationIconPink from "../../assets/svg/decentralization_pink.svg";
import airdropsIconPink from "../../assets/svg/airdrops_pink.svg";
import slashingIconPink from "../../assets/svg/slashing_pink.svg";

import {
  getContractByName,
  getValidatorByAddress,
} from "../../utils/contractFilters";
import WelcomeScreenPools from "../common/WelcomeScreenPools";
import { WalletStatus } from "@terra-money/wallet-provider";
import PoolInfo from "../common/PoolInfo";
import { saveTransaction } from "../../services/transactions";
import { Section } from "@terra-dev/neumorphism-ui/components/Section";
import { AirdropsTooltip } from "../tooltips/AirdropsTooltip";
import { updateUser } from "../../services/users";
import { getLunaPrice } from "../../services/currency";
import { getKyvApr } from "../../services/rewards";

import withMediaQuery from "../../media_query";
import InfoPageMobile from "../common/InfoPageMobile";

interface Props {
  primaryWalletAddress?: string;
  terra?: any;
  wallet?: any;
  walletFunds?: any;
  walletStatus?: any;
  toggleConnectWallet?: any;
  fetchWalletFunds?: any;
  mediaQuery: boolean;
}

function VaultList({
  primaryWalletAddress,
  terra,
  wallet,
  walletFunds,
  walletStatus,
  toggleConnectWallet,
  fetchWalletFunds,
  mediaQuery,
}: Props) {
  // const [loading, setLoading] = useState(false);

  const [spinner, setSpinner] = useState(false);
  const [successMessage, setShowSuccessMessage] = useState(false);
  const [tvlInfo, setTvlInfo] = useState({
    tvlRewards: 0,
    tvlRewardsInUSD: 0,
  });
  const [isDeviceMobile, setIsDeviceMobile] = useState(false);
  const [contractsInfo, setContractsInfo] = useState<any[]>([]);
  const [pools, setPools] = useState<any[]>([]);
  const [depositAmount, setDepositAmount] = useState(0);
  const [validationMsg, setValidationMsg] = useState("");
  const [selectedDepositAmount, setSelectedDepositAmount] = useState("");
  const [hoverState, setHoverState] = useState("");
  const [expandedPool, setExpandedPool] = useState(-1);
  const [estimatedTransactionFee, setEstimatedTransactionFee] = useState(0.05);
  const [estimatedGasFee, setEstimatedGasFee] = useState(0);
  const [gasPrices, setGasPrices] = useState<any>({});

  const getContractsAndPoolDetails = useCallback(async (walletAddress) => {
    try {
      const contractAddress = config.contractAddresses.staderHub;
      const tvlRewardsInfo = {
        tvlRewards: 0,
        tvlRewardsInUSD: 0,
      };
      const contracts = await terra.wasm.contractQuery(contractAddress, {
        get_all_contracts: {},
      });

      const validatorsData = await axios.get(config.VALIDATORS_URL);
      const gasPriceList = await axios.get(GAS_PRICES_URL);

      setGasPrices(gasPriceList.data);

      const lunaPrice: any = await getLunaPrice();

      const delegatorContractAddress = getContractByName(
        contracts,
        "Delegator"
      );

      const poolsContractAddress = getContractByName(contracts, "Pools");

      setContractsInfo(contracts);

      let userPoolsInfo: { pools: any } = {
        pools: [],
      };

      let stateData = await terra.wasm.contractQuery(
        poolsContractAddress.addr,
        {
          state: {},
        }
      );

      const poolData = await Promise.all(
        [...Array(stateData.state.next_pool_id)].map(
          async (poolId: any, index: number) => {
            const pool = await await terra.wasm.contractQuery(
              poolsContractAddress.addr,
              {
                pool: { pool_id: index },
              }
            );

            const kyvApr: any = await getKyvApr(index);
            pool.pool.computedApr =
              kyvApr.apr && kyvApr.apr > 0
                ? parseFloat(kyvApr.apr + airdropsAPR).toFixed(2)
                : 0;

            let userComputedInfo = await terra.wasm.contractQuery(
              poolsContractAddress.addr,
              {
                get_user_computed_info: {
                  pool_id: index,
                  user_addr: walletAddress,
                },
              }
            );

            if (userComputedInfo.info && userComputedInfo.info.deposit) {
              pool.pool.computed_deposit = userComputedInfo.info.deposit.staked;
            }

            tvlRewardsInfo.tvlRewards =
              tvlRewardsInfo.tvlRewards + parseInt(pool.pool.staked);
            return pool.pool;
          }
        )
      );

      userPoolsInfo.pools = poolData;

      let userInfo = await terra.wasm.contractQuery(
        delegatorContractAddress.addr,
        {
          user: { user_addr: walletAddress },
        }
      );

      let poolsConfig = await terra.wasm.contractQuery(
        poolsContractAddress.addr,
        {
          config: {},
        }
      );

      if (userPoolsInfo && userPoolsInfo.pools.length > 0) {
        userPoolsInfo.pools = userPoolsInfo.pools.map((pool: any) => {
          pool.validators = pool.validators.map((validator: string) => {
            const validatorInfo = getValidatorByAddress(
              validatorsData.data,
              validator
            );
            return validatorInfo;
          });

          return pool;
        });
      }

      userInfo.info.forEach((userDetails: any) => {
        userPoolsInfo.pools[userDetails.pool_id].pool_id = userDetails.pool_id;
        userPoolsInfo.pools[userDetails.pool_id].deposit =
          userDetails.deposit.staked;
        userPoolsInfo.pools[userDetails.pool_id].rewards =
          userDetails.pending_rewards;
        userPoolsInfo.pools[userDetails.pool_id].undelegations =
          userDetails.undelegations;
        userPoolsInfo.pools[userDetails.pool_id].airdrops =
          userDetails.pending_airdrops;
      });

      userPoolsInfo.pools.forEach((poolDetails: any, index: number) => {
        poolDetails.pool_id = poolDetails.pool_id ? poolDetails.pool_id : index;
        poolDetails.deposit = poolDetails.deposit ? poolDetails.deposit : 0;
        poolDetails.maxDepositAmount = parseInt(poolsConfig.config.max_deposit);
        poolDetails.minDepositAmount = parseInt(poolsConfig.config.min_deposit);
      });

      tvlRewardsInfo.tvlRewards = Math.round(
        lunaFormatter(tvlRewardsInfo.tvlRewards)
      );
      tvlRewardsInfo.tvlRewardsInUSD =
        lunaPrice.amount * tvlRewardsInfo.tvlRewards;
      setTvlInfo(tvlRewardsInfo);
      setPools(userPoolsInfo.pools);
    } catch (err) {
      console.log("Error reported in fetching contracts" + err);
    }
  }, []);

  const logFirebaseEvent = (eventName: string) => {
    const analytics = getAnalytics();
    logEvent(analytics, eventName);
  };

  const depositUserAmount = useCallback(
    async (
      poolIndex,
      pools,
      contracts,
      primaryWalletAddress,
      amount,
      gasAmount
    ) => {
      try {
        setSpinner(true);
        const poolsContractAddress: any = getContractByName(contracts, "Pools");

        const contractAddress = poolsContractAddress.addr;

        const msg = new MsgExecuteContract(
          primaryWalletAddress,
          contractAddress,
          {
            deposit: {
              pool_id: poolIndex,
            },
          },
          {
            uluna: (amount * 1000000).toFixed(),
          }
        );

        const txResult = await wallet.post({
          msgs: [msg],
          fee: new StdFee(
            gasAmount,
            `${(ustFeeStaking * 1000000).toFixed()}uusd`
          ),
          memo: messageMemo,
        });
        if (!(!!txResult.result && !!txResult.result.txhash)) {
          throw Error("Failed to send transaction");
        }

        if (txResult.result && txResult.result.txhash) {
          let updateAmount = (amount * 1000000).toFixed();

          pools[poolIndex].deposit =
            parseFloat(pools[poolIndex].deposit) + updateAmount;

          // let transactionType = transactionsTypeMap.DEPOSIT;
          // let coins = [{ denom: "uluna", amount: updateAmount }];
          // let txhash = txResult.result.txhash;
          let userAddress = primaryWalletAddress;
          // const payload = {
          // 	transactionType,
          // 	coins,
          // 	txhash,
          // 	userAddress,
          // 	poolId: `${poolIndex}`,
          // };

          const user = await updateUser(userAddress);
          // const response = await saveTransaction(payload);

          logFirebaseEvent("deposited");

          setPools(pools);
          setSpinner(false);
          setShowSuccessMessage(true);
          setTimeout(() => {
            getContractsAndPoolDetails(primaryWalletAddress);
          }, 1000);

          setTimeout(() => {
            fetchWalletFunds(primaryWalletAddress);
          }, 3000);
        }
      } catch (err) {
        setSpinner(false);
        console.log("Error reported in fetching pools" + err);
      }
    },
    []
  );

  useEffect(() => {
    if (
      primaryWalletAddress &&
      primaryWalletAddress !== "" &&
      !isDeviceMobile
    ) {
      getContractsAndPoolDetails(primaryWalletAddress);
    }

    if (mediaQuery !== isDeviceMobile) {
      setIsDeviceMobile(mediaQuery);
    }
  }, [primaryWalletAddress, mediaQuery]);

  function setValidationMessageForDepositAmount(
    depositAmount: number,
    availableAmount: any,
    maxDepositAmount: number,
    minDepositAmount: number,
    funds: any
  ) {
    let amount = parseFloat(availableAmount.replace(",", ""));
    let maxAmount = Math.min(lunaFormatter(maxDepositAmount), amount);
    let ustWalletBalance =
      funds && funds.uusd && formatUSTWithPostfixUnits(demicrofy(funds.uusd));
    ustWalletBalance =
      ustWalletBalance && parseInt(ustWalletBalance.replaceAll(",", ""));

    if (depositAmount > maxAmount) {
      setValidationMsg(`Deposit amount should be less than ${maxAmount} LUNA.`);
    } else if (depositAmount < lunaFormatter(minDepositAmount)) {
      setValidationMsg(
        `Deposit amount should be more than ${lunaFormatter(
          minDepositAmount
        )} LUNA`
      );
    } else {
      setValidationMsg("");
    }

    if (ustWalletBalance < ustFeeStaking || !ustWalletBalance) {
      setValidationMsg("Not enough UST for transaction fee");
    }
  }

  const updateDepositAmount = useCallback(
    (
      nextDepositAmount,
      availableAmount,
      walletAddress,
      contracts,
      maxDepositAmount,
      minDepositAmount,
      poolId,
      funds
    ) => {
      setDepositAmount(nextDepositAmount);
      setValidationMessageForDepositAmount(
        Number(nextDepositAmount),
        availableAmount,
        maxDepositAmount,
        minDepositAmount,
        funds
      );

      estimateTransactionFee(
        Number(nextDepositAmount),
        walletAddress,
        contracts,
        poolId
      );
    },
    []
  );

  const updateDepositAmountByPercentage = (
    amountPercentage: string,
    availableAmount: any,
    walletAddress: string,
    contracts: any,
    maxDepositAmount: number,
    minDepositAmount: number,
    poolId: number,
    funds: any
  ) => {
    setSelectedDepositAmount(amountPercentage);
    const availableFunds = parseFloat(
      formatUSTWithPostfixUnits(demicrofy(funds.uluna)).replace(/,/g, "")
    );

    let depositAmount = Math.min(availableFunds * 1000000, maxDepositAmount);

    if (amountPercentage === "25%") {
      depositAmount = depositAmount * 0.25;
    } else if (amountPercentage === "50%") {
      depositAmount = depositAmount * 0.5;
    } else if (amountPercentage === "75%") {
      depositAmount = depositAmount * 0.75;
    }

    depositAmount = lunaFormatter(depositAmount);

    updateDepositAmount(
      depositAmount,
      availableAmount,
      walletAddress,
      contracts,
      maxDepositAmount,
      minDepositAmount,
      poolId,
      funds
    );
  };

  const resetDepositInfo = () => {
    setValidationMsg("");
    setDepositAmount(0);
    setSelectedDepositAmount("");

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 300);
  };

  const closeSuccessMessageAndReset = () => {
    setShowSuccessMessage(false);
    setSpinner(true);

    setTimeout(() => {
      setValidationMsg("");
      setDepositAmount(0);
      setSelectedDepositAmount("");
    }, 300);

    setTimeout(() => {
      setSpinner(false);
    }, 1000);
  };

  const expandPoolSection = (poolName: number) => {
    if (!spinner) {
      if (expandedPool === poolName) {
        setExpandedPool(-1);
      } else {
        if (successMessage) {
          closeSuccessMessageAndReset();
          setTimeout(() => {
            setExpandedPool(poolName);
          }, 1000);
        } else {
          resetDepositInfo();
          setExpandedPool(poolName);
        }
      }
    }
  };

  const estimateTransactionFee = async (
    depositAmount: number,
    walletAddress: string,
    contracts: any,
    poolId: number
  ) => {
    const poolsContractAddress: any = getContractByName(contracts, "Pools");
    const contractAddress = poolsContractAddress.addr;

    let msgs: any[] = [];

    const msg = new MsgExecuteContract(
      walletAddress,
      contractAddress,
      {
        deposit: {
          pool_id: poolId,
        },
      },
      { uluna: (depositAmount * 1000000).toFixed() }
    );

    msgs.push(msg);

    if (depositAmount > 0 && msgs && msgs.length > 0) {
      terra.tx
        .estimateFee(walletAddress, msgs)
        .then((fee: any) => {
          const estimateTxFee = parseFloat(
            formatUSTWithPostfixUnits(demicrofy(fee.amount._coins.uluna.amount))
          ).toFixed(2);
          setEstimatedTransactionFee(parseFloat(estimateTxFee));
          setEstimatedGasFee(fee.gas);
        })
        .catch((err: any) => console.log("Error"));
    }
  };

  const poolsSection = (
    <div>
      {pools.map((pool: any, index: number) => (
        <PoolInfo
          key={`pool-${pool.name}`}
          index={index}
          isExpanded={expandedPool === index}
          isLoading={
            (spinner || walletStatus === WalletStatus.INITIALIZING) &&
            !successMessage &&
            expandedPool === index
          }
          gasAmount={estimatedGasFee}
          isTransactionSuccessful={
            !spinner && successMessage && expandedPool === index
          }
          walletFunds={walletFunds}
          primaryWalletAddress={primaryWalletAddress}
          contractsInfo={contractsInfo}
          pools={pools}
          pool={pool}
          tvlInfo={tvlInfo}
          depositAmount={depositAmount}
          validationMsg={validationMsg}
          selectedDepositAmount={selectedDepositAmount}
          depositUserAmount={depositUserAmount}
          expandPoolSection={expandPoolSection}
          gasPrices={gasPrices}
          estimatedTransactionFee={estimatedTransactionFee}
          resetDepositInfo={closeSuccessMessageAndReset}
          setSelectedDepositAmount={setSelectedDepositAmount}
          updateDepositAmount={updateDepositAmount}
          updateDepositAmountByPercentage={updateDepositAmountByPercentage}
        />
      ))}
    </div>
  );

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
        <div className="VaultsContainer">
          {isDeviceMobile ? (
            <div>
              <InfoPageMobile />
            </div>
          ) : pools && pools.length > 0 ? (
            <div>
              <div
                className="d-flex flex-column align-items-center m-auto"
                style={{ width: "fit-content" }}
              >
                <Section className="w-100 vaultListDiv vaultListDetails vaultListDivTvl">
                  <div className="vaultListDetailsContainer justify-content-center">
                    <p className="vaultListDetailsHeader">Stake Pools TVL</p>
                    <div className="d-flex justify-content-center align-items-center">
                      <p className="vaultHeaderAmount mb-0">
                        <span className="gradientText">
                          {tvlInfo.tvlRewards.toLocaleString()}
                        </span>
                        <span className="ms-2 vaultHeaderAmountSmall">
                          LUNA{" "}
                        </span>
                      </p>
                    </div>
                  </div>
                </Section>
                <Section className="w-100 vaultListDiv vaultListDetails">
                  <div className="vaultListDetailsContainer">
                    <p className="vaultListDetailsHeader">All Stader pools</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <Tooltip
                        title={<AirdropsTooltip />}
                        arrow
                        placement={"bottom-start"}
                        classes={{
                          tooltip: "tooltip-airdrops",
                          arrow: "arrow",
                        }}
                      >
                        <div
                          className="d-flex justify-content-between align-items-center my-3 mx-2 cursor-pointer"
                          onMouseEnter={() => setHoverState("airdrops")}
                          onMouseLeave={() => setHoverState("")}
                        >
                          <img
                            src={
                              hoverState === "airdrops"
                                ? airdropsIconPink
                                : airdropsIcon
                            }
                            alt="airdrops"
                            className="vaultListDetailsIcon"
                          />
                          <p
                            className={
                              hoverState === "airdrops"
                                ? "vaultListDetailsText vaultListDetailsTextHovered"
                                : "vaultListDetailsText"
                            }
                          >
                            Include Airdrops
                          </p>
                        </div>
                      </Tooltip>
                      <Tooltip
                        title={tooltips.decentralization}
                        arrow
                        placement={"bottom-start"}
                        classes={{
                          tooltip: "tooltip",
                          arrow: "arrow",
                        }}
                      >
                        <div
                          className="d-flex justify-content-between align-items-center my-3 mx-2 cursor-pointer"
                          onMouseEnter={() => setHoverState("decentralization")}
                          onMouseLeave={() => setHoverState("")}
                        >
                          <img
                            src={
                              hoverState === "decentralization"
                                ? decentralizationIconPink
                                : decentralizationIcon
                            }
                            alt="decentralization"
                            className="vaultListDetailsIcon"
                          />
                          <p
                            className={
                              hoverState === "decentralization"
                                ? "vaultListDetailsText vaultListDetailsTextHovered"
                                : "vaultListDetailsText"
                            }
                          >
                            Promote Decentralization
                          </p>
                        </div>
                      </Tooltip>
                      <Tooltip
                        title={tooltips.slashing}
                        arrow
                        placement={"bottom-start"}
                        classes={{
                          tooltip: "tooltip",
                          arrow: "arrow",
                        }}
                      >
                        <div
                          className="d-flex justify-content-between align-items-center my-3 mx-2 cursor-pointer"
                          onMouseEnter={() => setHoverState("slashing")}
                          onMouseLeave={() => setHoverState("")}
                        >
                          <img
                            src={
                              hoverState === "slashing"
                                ? slashingIconPink
                                : slashingIcon
                            }
                            alt="airdrops"
                            className="vaultListDetailsIcon"
                          />
                          <p
                            className={
                              hoverState === "slashing"
                                ? "vaultListDetailsText vaultListDetailsTextHovered"
                                : "vaultListDetailsText"
                            }
                          >
                            Minimize Slashing
                          </p>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </Section>
                {/* <Section className="w-100 vaultListDiv vaultListDetails vaultListDivMaintenance">
									<div className="vaultListDetailsContainer flex-column justify-content-center">
										<img
											src={maintenanceIcon}
											alt="maintenance"
											className="mb-4"
										/>
										<div className="d-flex flex-column justify-content-center align-items-center">
											<p className="vaultMaintenanceHeader">
												Contracts are Under Maintenance!
											</p>
											<p className="vaultSecondaryHeader mt-0">
												For any further update, please follow our Twitter
											</p>
										</div>
									</div>
								</Section> */}
              </div>
              <div className="vaultListMarginBottom">
                <div className="vaultListHeader">
                  <table className="vaultListTableWidth">
                    <tr className="TableRow">
                      <th className="TableHeaderCell vaultListCellFlexHeader">
                        Stake Pools
                      </th>
                      <th className="TableHeaderCell vaultListFlexCenter">
                        My Deposits{" "}
                      </th>
                      <th className="TableHeaderCell vaultListFlexCenter vaultListInfo">
                        APR{" "}
                        <Tooltip
                          title={tooltips.poolsAPR}
                          classes={{
                            tooltip: "tooltip",
                            arrow: "arrow",
                          }}
                          placement={"bottom"}
                          arrow
                        >
                          <InfoOutlinedIcon className="vaultInfoIcon" />
                        </Tooltip>
                      </th>
                      <th className="TableHeaderCell vaultListCellEmpty"></th>
                    </tr>
                  </table>
                </div>
              </div>
              {poolsSection}
            </div>
          ) : (
            <Loader
              classes={"loaderContainer loaderContainer60"}
              loaderText={PAGE_LOADER_TEXT}
            />
          )}
        </div>
      ) : (
        <div className="VaultsContainer">
          <WelcomeScreenPools toggleConnectWallet={toggleConnectWallet} />
        </div>
      )}
    </div>
  );
}

export default withMediaQuery("(max-width:1024px)")(VaultList);
