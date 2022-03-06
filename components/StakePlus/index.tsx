import { useAppContext } from "@libs/appContext";
import { Button, ClickAwayListener, Grid } from "@material-ui/core";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import c from "classnames";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { config } from "../../config/config";
import { useStakeAirdropsDialog } from "../../dialogs/stakeAirdropsDialog";
import ValidatorTemplate from "../../stader-ui-lib/templates/SPValidators/SPValidators";
import { useStakeDelegationDialog } from "../../dialogs/stakeDelegationDialog";
import { useStakeDepositDialog } from "../../dialogs/stakeDepositDialog";
import { useStakeUnDelegationDialog } from "../../dialogs/stakeUnDelegationDialog";
import { lunaFormatter, lunaFormatterOrion } from "../../utils/CurrencyHelper";
import styles from "./StakePlus.module.scss";
import { Loader } from "@atoms/index";
import { PAGE_LOADER_TEXT } from "@constants/constants";
import axios from "axios";
import WelcomeScreenPools from "../common/WelcomeScreenPools";

// for representational purpose
export type ValidatorInfo = {
  operatorAddress: string;
  name: string;
  apr: string;
  uptime: string;
  commission: string;
  votingPower: string;
};

export type StakeContractInfo = {
  stakeContractAddress: string;
  operatorAddress: string;
};

export type ValidatorStakingInfoMap = { [validator: string]: ValidatorInfo };

const StakePlus: React.FC = () => {
  const [openStakeDelegationDialog, stakeDelegationDialogElement] =
    useStakeDelegationDialog();
  const [openUnStakeDelegationDialog, stakeUnDelegationDialogElement] =
    useStakeUnDelegationDialog();
  const [openStakeAirdropsDialog, stakeAirdropsDialogElement] =
    useStakeAirdropsDialog();
  const [openStakeDepositDialog, stakeDepositDialogElement] =
    useStakeDepositDialog();
  const [stakeContractInfo, setStakeContractInfo] = useState<StakeContractInfo>(
    {
      stakeContractAddress: "",
      operatorAddress: "",
    }
  );
  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const [allDelegateValidator, setAllDelegateValidatorInfo] = useState<any[]>(
    []
  );
  const [allUndelegationValidator, setAllUndelegationValidatorInfo] = useState<
    any[]
  >([]);
  const [totalDelegateInvestValidator, setTotalDelegateInvestValidator] =
    useState<number>(0);
  const [totalAirdrops, setTotalAirdrops] = useState<any>({});
  const [validatorStakingInfoMap, setValidatorStakingInfoMap] =
    useState<ValidatorStakingInfoMap>({});
  const [totalUndelegateInvestValidator, setTotalUndelegateInvestValidator] =
    useState<number>(0);

  const [viewAirdropsDropdown, setViewAirdropsDropdown] = useState(false);

  const { walletAddress, terra, walletBalance, updateWalletBalance } =
    useAppContext();
  const wallet = useWallet();

  const fetchDelegateUserInfo = async (
    contractAddress: any,
    walletAddress: any
  ) => {
    try {
      return await terra.wasm.contractQuery(contractAddress, {
        get_user_info: {
          user_addr: walletAddress,
        },
      });
    } catch (e) {
      console.log("Error reported in fetching userInfo " + e);
    }
  };

  const fetchUndelegateUserInfo = async (
    contractAddress: any,
    walletAddress: any
  ) => {
    try {
      return await terra.wasm.contractQuery(contractAddress, {
        get_user_undelegation_records: {
          user_addr: walletAddress,
        },
      });
    } catch (e) {
      console.log("Error reported in fetching undelegate data " + e);
    }
  };

  const fetchUndelegateBatchInfo = async (
    contractAddress: any,
    walletAddress: any,
    batchId: any
  ) => {
    try {
      return await terra.wasm.contractQuery(contractAddress, {
        batch_undelegation: {
          batch_id: batchId,
        },
      });
    } catch (e) {
      console.log("Error reported in fetching undelegate data " + e);
    }
  };

  const fetchValidatorAPR = async (
    validators: string[]
  ): Promise<{ [validator: string]: string }> => {
    const validatorToApr: { [validator: string]: string } = {};

    for (const validator of validators) {
      // const validatorKyvMetricsResponse = await axios.post(config.KYV_URL, {
      //   validator,
      //   timestampOffset: 0,
      //   timestampLimit: 1
      // });
      // const validatorKyvMetrics: any = validatorKyvMetricsResponse.data;
      // const validatorKyvMetricsInfo = validatorKyvMetrics?.metrics[0];
      validatorToApr[validator] = (config as any).validatorAprs[validator];
    }

    return Promise.resolve(validatorToApr);
  };

  const fetchValidatorStakingInfo = async (
    validators: string[]
  ): Promise<ValidatorStakingInfoMap> => {
    const validatorInfoMap: { [validator: string]: ValidatorInfo } = {};

    // get the validator comission rate and all other info
    const allValidatorsData = await axios.get(config.VALIDATORS_URL);
    // @ts-ignore
    const filteredValidators = allValidatorsData.data?.validators.filter(
      (item: any, index: number) => {
        return validators.includes(item.operatorAddress);
      }
    );

    const validatorToAprMap = await fetchValidatorAPR(validators);

    for (const filteredValidator of filteredValidators) {
      const operatorAddress: string = filteredValidator?.operatorAddress;
      validatorInfoMap[operatorAddress] = {
        apr: validatorToAprMap[operatorAddress],
        operatorAddress,
        commission: (
          parseFloat(filteredValidator?.commissionInfo?.rate) * 100
        ).toFixed(1),
        uptime: (filteredValidator?.upTime * 100).toFixed(1),
        votingPower: (
          parseFloat(filteredValidator?.votingPower?.weight) * 100
        ).toFixed(1),
        name: filteredValidator?.description?.moniker,
      };
    }

    return Promise.resolve(validatorInfoMap);
  };

  const getAllValidatorInfo = async (walletAddress: string) => {
    try {
      let totalDelegateDeposits = 0,
        totalUndelegateDeposits = 0;
      let totalAirdrops = {
        mir: 0,
        anc: 0,
        twd: 0,
        orion: 0,
        mine: 0,
        vkr: 0,
      };

      const validatorDetail = {
        validator_name: "",
        contract_address: "",
        operator_address: "",
      };

      const validatorOperatingAddresses = Object.keys(config.stakePlus);

      const validatorStakingInfo = await fetchValidatorStakingInfo(
        validatorOperatingAddresses
      );
      setValidatorStakingInfoMap(validatorStakingInfo);

      const validatorDelegateInfo = await Promise.all(
        validatorOperatingAddresses.map(async (item: string) => {
          const contractAddress = (config as any).stakePlus[item];
          const validators = await fetchDelegateUserInfo(
            contractAddress,
            walletAddress
          );
          validatorDetail.validator_name = validatorStakingInfo[item].name;
          validatorDetail.contract_address = contractAddress;
          validatorDetail.operator_address =
            validatorStakingInfo[item].operatorAddress;
          validators.user_info["validator_info"] = {
            ...validators.user_info["validator_info"],
            ...validatorDetail,
          };
          totalDelegateDeposits =
            totalDelegateDeposits +
            parseInt(validators?.user_info?.total_amount?.amount);
          validators?.user_info?.total_airdrops.map((item: any, index: any) => {
            if (item["denom"] === "orion") {
              // @ts-ignore
              totalAirdrops[item["denom"]] += lunaFormatterOrion(
                parseInt(item["amount"])
              );
            } else {
              // @ts-ignore
              totalAirdrops[item["denom"]] += lunaFormatter(
                parseInt(item["amount"])
              );
            }
          });
          return validators;
        })
      );
      const validatorUndelegationInfo = await Promise.all(
        validatorOperatingAddresses.map(async (item: string) => {
          const contractAddress = (config as any).stakePlus[item];
          const undelegationValidator = await fetchUndelegateUserInfo(
            contractAddress,
            walletAddress
          );
          undelegationValidator.forEach(
            async (infoItem: any, index: number) => {
              const undelegateBatchInfo = await fetchUndelegateBatchInfo(
                contractAddress,
                walletAddress,
                infoItem.batch_id
              );
              infoItem["batch_info"] = undelegateBatchInfo;
              if (infoItem.batch_info.batch.est_release_time) {
                infoItem.batch_info.batch.est_release_time = moment
                  .unix(
                    Number(infoItem.batch_info.batch.est_release_time) /
                      1000000000
                  )
                  .add(15, "minutes")
                  .format("lll");
              }
            }
          );
          validatorDetail.validator_name = validatorStakingInfo[item].name;
          validatorDetail.contract_address = contractAddress;
          validatorDetail.operator_address =
            validatorStakingInfo[item].operatorAddress;
          if (undelegationValidator.length != 0) {
            undelegationValidator.forEach(async (item: any, index: number) => {
              undelegationValidator[index]["validator_info"] = {
                ...undelegationValidator[index]["validator_info"],
                ...validatorDetail,
              };
              totalUndelegateDeposits =
                totalUndelegateDeposits +
                parseInt(undelegationValidator[index]?.amount);
            });
          }
          return undelegationValidator;
        })
      );
      let allUndelegateFilterData: any = [];
      setAllDelegateValidatorInfo(validatorDelegateInfo);
      validatorUndelegationInfo.forEach(
        async (infoItem: any, index: number) => {
          if (infoItem.length != 0) {
            allUndelegateFilterData.push(infoItem);
          }
        }
      );
      setAllUndelegationValidatorInfo(allUndelegateFilterData);
      setTotalDelegateInvestValidator(totalDelegateDeposits);
      setTotalUndelegateInvestValidator(totalUndelegateDeposits);
      setTotalAirdrops(totalAirdrops);
      return { success: true, message: "Successful" };
    } catch (err) {
      console.error("Error reported in fetching contracts" + err);
    }
  };

  const { refetch, isLoading } = useQuery(
    [walletAddress],
    () => getAllValidatorInfo(walletAddress),
    {
      onSuccess: (res) => {},
    }
  );

  const refreshPage = async () => {
    try {
      // setPageLoader(true);
      await updateWalletBalance();
      await refetch();
      // setPageLoader(false);
    } catch (e) {
      // setPageLoader(false);
      console.log("error refreshing page");
      console.log(e);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let validatorParam = urlParams.get("validator");
    const validators = Object.keys(config.stakePlus).map((item, index) => item);
    if (!validatorParam || !validators.includes(validatorParam)) {
      validatorParam =
        validators[Math.floor(Math.random() * validators.length)];
    }

    setStakeContractInfo({
      operatorAddress: validatorParam,
      stakeContractAddress: (config as any).stakePlus[validatorParam as string],
    });
  }, []);

  const showAirdroplist = (e: any) => {
    e.stopPropagation();
    setViewAirdropsDropdown(!viewAirdropsDropdown);
  };

  const onClickAwayViewAirdrops = () => {
    // setViewAirdropData({})
    setViewAirdropsDropdown(false);
  };

  useEffect(() => {
    if (walletAddress) {
      // setPageLoader(true);
      refetch();
      // setPageLoader(false);
    }
  }, [walletAddress]);

  if (wallet.status === WalletStatus.INITIALIZING || pageLoader)
    return <Loader text={PAGE_LOADER_TEXT} />;

  // if (wallet.status === WalletStatus.WALLET_NOT_CONNECTED || !walletAddress)
  //   return <WelcomeScreenPools />;

  return (
    <div>
      {Object.keys(validatorStakingInfoMap).length != 0 && (
        <ValidatorTemplate
          validatorStakingInfoMap={validatorStakingInfoMap}
          stakeContractInfo={stakeContractInfo}
        />
      )}
      {Object.keys(validatorStakingInfoMap).length != 0 && (
        <div className="deposite-container">
          <Grid item xs={2} className={c(styles.marginAuto)}>
            <Button
              className={c(styles.outlineNoBgBtn)}
              onClick={() => {
                openStakeDepositDialog({
                  stakeContractInfo,
                  validatorStakingInfoMap,
                  refreshPage,
                });
              }}
            >
              Deposit
            </Button>
          </Grid>
        </div>
      )}
      <div className={c(styles.stakePlusDivider)} />
      <p className={c(styles.stakePlusTitle)}>Portfolio</p>
      <Grid container spacing={4}>
        <Grid
          item
          xs={4}
          md={4}
          onClick={() => {
            openStakeDelegationDialog({
              refreshPage,
              wallet: wallet,
              walletAddress: walletAddress,
              terra: terra,
              walletBalance: walletBalance,
              allDelegateValidator: allDelegateValidator,
            });
          }}
        >
          <div className={c(styles.stakeGridBox)}>
            <span className={c(styles.chevron)}>&rsaquo;</span>
            <p className={c(styles.title)}>Delegations</p>
            <p>{lunaFormatter(totalDelegateInvestValidator)} LUNA</p>
          </div>
        </Grid>
        <Grid
          item
          xs={4}
          md={4}
          onClick={() => {
            openUnStakeDelegationDialog({
              refreshPage,
              wallet: wallet,
              walletAddress: walletAddress,
              terra: terra,
              walletBalance: walletBalance,
              allUndelegationValidator: allUndelegationValidator,
            });
          }}
        >
          <div className={c(styles.stakeGridBox)}>
            <span className={c(styles.chevron)}>&rsaquo;</span>
            <p className={c(styles.title)}>Undelegations</p>
            <p>{lunaFormatter(totalUndelegateInvestValidator)} LUNA</p>
          </div>
        </Grid>
        <Grid
          item
          xs={4}
          md={4}
          onClick={() => {
            openStakeAirdropsDialog({
              wallet: wallet,
              walletAddress: walletAddress,
              refreshPage: refreshPage,
              terra: terra,
              walletBalance: walletBalance,
              allDelegateValidator: allDelegateValidator,
            });
          }}
        >
          <div className={c(styles.stakeGridBox)}>
            <span className={c(styles.chevron)}>&rsaquo;</span>
            <p className={c(styles.title)}>Airdrops</p>
            <div className="flex">
              <div className="flex items-center mr-1">
                <h1 className="font-normal text-white">
                  {totalAirdrops["anc"] && totalAirdrops["anc"].toFixed(4)}
                </h1>
                <div className="ml-2 mr-1">
                  <p className="font-normal text-white">ANC</p>
                </div>
                <img src="/static/anc.png" alt="anc" style={{ height: 10 }} />
              </div>
              <div className="flex items-center ml-2">
                <h1 className="font-normal text-white">
                  {totalAirdrops["mir"] && totalAirdrops["mir"].toFixed(4)}
                </h1>
                <div className="ml-2 mr-1">
                  <p className="font-normal text-white">MIR</p>
                </div>
                <img src="/static/mir.png" alt="anc" style={{ height: 10 }} />
              </div>
              {Object.keys(totalAirdrops).length > 2 ? (
                <div className="flex items-center ml-2">
                  <div
                    className={c(styles.countCircleContainer)}
                    onClick={(e) => {
                      showAirdroplist(e);
                    }}
                  >
                    <span>+{Object.keys(totalAirdrops).length - 2}</span>
                  </div>
                </div>
              ) : (
                ""
              )}
              {viewAirdropsDropdown && (
                <div className="dropdown-container">
                  <ClickAwayListener onClickAway={onClickAwayViewAirdrops}>
                    <div className="dropdown-box filterDropdown">
                      <div className="filterDropdownContainer">
                        <div className={c(styles.filterItemList)}>
                          {totalAirdrops &&
                            Object.keys(totalAirdrops)?.map(
                              (item: any, index: number) => (
                                <div className="flex items-center" key={index}>
                                  <h2 className="font-normal text-white">
                                    {totalAirdrops[item] != 0
                                      ? totalAirdrops[item].toFixed(4)
                                      : 0}
                                  </h2>
                                  <div className="ml-2 mr-1">
                                    <p className="font-normal text-white">
                                      {item.toUpperCase()}
                                    </p>
                                  </div>
                                  <img
                                    src={
                                      item === "anc"
                                        ? "/static/anc.png"
                                        : item === "mir"
                                        ? "/static/mir.png"
                                        : item === "mine"
                                        ? "/static/pylon.png"
                                        : item === "orion"
                                        ? "/static/orion.png"
                                        : item === "twd"
                                        ? "/static/twd.png"
                                        : "/static/valkyrie.png"
                                    }
                                    alt={item}
                                    height={12}
                                    style={{ marginLeft: 2 }}
                                    className={c(styles.legendImage)}
                                  />
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    </div>
                  </ClickAwayListener>
                </div>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
      {stakeDelegationDialogElement}
      {stakeUnDelegationDialogElement}
      {stakeAirdropsDialogElement}
      {stakeDepositDialogElement}
    </div>
  );
};

export default StakePlus;
