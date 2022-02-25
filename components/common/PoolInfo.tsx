import { Button, Grid, InputAdornment } from "@material-ui/core";
import { Section } from "@terra-dev/neumorphism-ui/components/Section";
import { NumberInput } from "@terra-dev/neumorphism-ui/components/NumberInput";
import { IconSpan } from "@terra-dev/neumorphism-ui/components/IconSpan";
import {
  demicrofy,
  formatUSTWithPostfixUnits,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from "@anchor-protocol/notation";

import { lunaFormatter } from "../../utils/CurrencyHelper";
import Loader from "./Loader";
import SuccessAnimation from "./SuccessAnimation";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CloseIcon from "@material-ui/icons/Close";

import ArrowUp from "../../assets/svg/arrow_up.svg";
import ArrowDown from "../../assets/svg/arrow_down.svg";
import communityPoolIcon from "../../assets/svg/community_pool.svg";
import blueChipPoolIcon from "../../assets/svg/blue_chip_pool.svg";
import airdropsPlusPoolIcon from "../../assets/svg/airdrops_plus_pool.svg";
import { poolsDetails, ustFeeStaking } from "../../constants/constants";

export interface Props {
  index: number;
  isExpanded?: boolean;
  isLoading: boolean;
  isTransactionSuccessful: boolean;
  walletFunds: any;
  primaryWalletAddress?: string;
  contractsInfo: any;
  pools: any;
  pool: any;
  tvlInfo: any;
  depositAmount: number;
  validationMsg: string;
  selectedDepositAmount: string;
  gasPrices: any;
  estimatedTransactionFee: number;
  gasAmount: number;
  depositUserAmount: any;
  expandPoolSection: any;
  resetDepositInfo: any;
  setSelectedDepositAmount: any;
  updateDepositAmount: any;
  updateDepositAmountByPercentage: any;
}

const PoolInfo = ({
  index,
  isExpanded,
  isLoading,
  isTransactionSuccessful,
  walletFunds,
  primaryWalletAddress,
  contractsInfo,
  pools,
  pool,
  tvlInfo,
  depositAmount,
  validationMsg,
  selectedDepositAmount,
  gasPrices,
  estimatedTransactionFee,
  gasAmount,
  depositUserAmount,
  expandPoolSection,
  resetDepositInfo,
  setSelectedDepositAmount,
  updateDepositAmount,
  updateDepositAmountByPercentage,
}: Props) => {
  return (
    <Section
      className={isExpanded ? "vaultListDiv" : "vaultListDiv vaultListDivHover"}
    >
      <table className="vaultListTableWidth">
        <div>
          <div
            className="TableRow TableRowPools cursor-pointer"
            onClick={() => expandPoolSection(index)}
          >
            <div className="TableBodyCell vaultListCellFlex verticalFlex d-flex flex-column">
              <div>
                <IconSpan
                  className={
                    pool.name.includes("Airdrops Plus")
                      ? "iconSpan airdropsPlusPool"
                      : pool.name.includes("Community")
                      ? "iconSpan communityPool"
                      : "iconSpan blueChipPool"
                  }
                >
                  <img
                    src={
                      pool.name.includes("Airdrops Plus")
                        ? airdropsPlusPoolIcon
                        : pool.name.includes("Community")
                        ? communityPoolIcon
                        : blueChipPoolIcon
                    }
                    alt="community"
                    className="poolIcon"
                  />
                  {pool.name.replace("Pool", "")}
                </IconSpan>
              </div>
              <div className="d-flex mt-3">
                {poolsDetails[
                  pool.name.replace("Pool", "").includes("Airdrops Plus")
                    ? "Airdrops Plus"
                    : (pool.name.replace(
                        "Pool",
                        ""
                      ) as keyof typeof poolsDetails)
                ].tags.map((tag: any) => (
                  <p
                    className="poolTag"
                    key={`${pool.name.replace("Pool", "")}-tag-${tag}`}
                  >
                    {tag}
                  </p>
                ))}
              </div>
            </div>

            <div className="TableBodyCell vaultListFlexCenter vaultListText">
              {pool.computed_deposit && pool.computed_deposit > 0
                ? lunaFormatter(pool.computed_deposit)
                : pool.deposit > 0
                ? lunaFormatter(pool.deposit)
                : 0}{" "}
              <span className="vaultListTextSmall">LUNA</span>
            </div>
            <div className="TableBodyCell vaultListFlexCenter vaultListText">
              {pool.computedApr && pool.computedApr > 0
                ? `${pool.computedApr}%`
                : "N.A"}
            </div>
            <div className="TableBodyCell vaultListFlexType">
              <Button
                disableFocusRipple
                disableTouchRipple
                disableRipple
                className="expandButton"
                onClick={() => expandPoolSection(index)}
              >
                {isExpanded ? (
                  <img src={ArrowUp} alt="icom" />
                ) : (
                  <img src={ArrowDown} alt="icom" />
                )}
              </Button>
            </div>
          </div>
          {isExpanded ? (
            <div className="poolDetails">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <div className="d-flex align-items-center">
                    <p className="poolHeader me-3">
                      {
                        poolsDetails[
                          pool.name
                            .replace("Pool", "")
                            .includes("Airdrops Plus")
                            ? "Airdrops Plus"
                            : (pool.name.replace(
                                "Pool",
                                ""
                              ) as keyof typeof poolsDetails)
                        ].description
                      }
                    </p>
                    <a
                      href={
                        poolsDetails[
                          pool.name
                            .replace("Pool", "")
                            .includes("Airdrops Plus")
                            ? "Airdrops Plus"
                            : (pool.name.replace(
                                "Pool",
                                ""
                              ) as keyof typeof poolsDetails)
                        ].faq
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="learnMoreLink"
                    >
                      Learn More
                    </a>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    spacing={3}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item sm={12} md={7}>
                      {isLoading ? (
                        <div className="poolDetailsTable">
                          <Loader classes={"loaderContainer"} />
                        </div>
                      ) : isTransactionSuccessful ? (
                        <div className="poolDetailsTable poolDetailSuccess">
                          <div className="poolDetailSuccessIcon">
                            <SuccessAnimation />
                          </div>

                          <div className="successDetails">
                            <p className="successHeader">
                              Your deposit of{" "}
                              {parseFloat(depositAmount.toString()).toFixed(4)}{" "}
                              LUNA is successful!
                            </p>
                            <div className="successRedirectInfo">
                              <p className="successRedirectInfoText">
                                Rewards are set tp 100% auto-compunding by
                                default to maximize returns. To change the
                                strategy, visit the{" "}
                                <a
                                  href={"/strategies"}
                                  className="successRedirectInfoLink"
                                  onClick={() => resetDepositInfo()}
                                >
                                  Strategies page <ChevronRightIcon />
                                </a>
                              </p>
                            </div>
                          </div>
                          <CloseIcon
                            className="poolDetailCloseIcon"
                            onClick={() => resetDepositInfo()}
                          />
                        </div>
                      ) : (
                        <div className="poolDetailsTable">
                          <div className="poolDetailsHeader">
                            <p className="availableAmount">
                              Available LUNA:{" "}
                              {walletFunds && walletFunds.uluna
                                ? formatUSTWithPostfixUnits(
                                    demicrofy(walletFunds.uluna)
                                  )
                                : 0}
                            </p>
                            {!!validationMsg && validationMsg !== "" && (
                              <p className="validation">{validationMsg}</p>
                            )}
                            {(!validationMsg || validationMsg === "") &&
                              depositAmount > 0 && (
                                <p className="validation">
                                  Transaction Fee: {`${ustFeeStaking} UST`}
                                </p>
                              )}
                          </div>

                          <div>
                            <NumberInput
                              className="amountField"
                              value={depositAmount}
                              maxIntegerPoinsts={
                                LUNA_INPUT_MAXIMUM_INTEGER_POINTS
                              }
                              maxDecimalPoints={
                                LUNA_INPUT_MAXIMUM_DECIMAL_POINTS
                              }
                              label="Amount"
                              onChange={({ target }) => {
                                setSelectedDepositAmount("");
                                updateDepositAmount(
                                  target.value,
                                  formatUSTWithPostfixUnits(
                                    demicrofy(walletFunds.uluna)
                                  ),
                                  primaryWalletAddress,
                                  contractsInfo,
                                  pool.maxDepositAmount,
                                  pool.minDepositAmount,
                                  index,
                                  walletFunds
                                );
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    className="adornment"
                                  >
                                    LUNA
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <div className="depositContainer">
                              <div className="depositStakes">
                                <div
                                  className={
                                    selectedDepositAmount === "25%"
                                      ? "depositAmountContainerActive"
                                      : "depositAmountContainer"
                                  }
                                >
                                  <div
                                    className="depositAmountItem"
                                    onClick={() =>
                                      updateDepositAmountByPercentage(
                                        "25%",
                                        formatUSTWithPostfixUnits(
                                          demicrofy(walletFunds.uluna)
                                        ),
                                        primaryWalletAddress,
                                        contractsInfo,
                                        pool.maxDepositAmount,
                                        pool.minDepositAmount,
                                        index,
                                        walletFunds
                                      )
                                    }
                                  >
                                    25%
                                  </div>
                                </div>
                                <div
                                  className={
                                    selectedDepositAmount === "50%"
                                      ? "depositAmountContainerActive"
                                      : "depositAmountContainer"
                                  }
                                >
                                  <div
                                    className="depositAmountItem"
                                    onClick={() =>
                                      updateDepositAmountByPercentage(
                                        "50%",
                                        formatUSTWithPostfixUnits(
                                          demicrofy(walletFunds.uluna)
                                        ),
                                        primaryWalletAddress,
                                        contractsInfo,
                                        pool.maxDepositAmount,
                                        pool.minDepositAmount,
                                        index,
                                        walletFunds
                                      )
                                    }
                                  >
                                    50%
                                  </div>
                                </div>
                                <div
                                  className={
                                    selectedDepositAmount === "75%"
                                      ? "depositAmountContainerActive"
                                      : "depositAmountContainer"
                                  }
                                >
                                  <div
                                    className="depositAmountItem"
                                    onClick={() =>
                                      updateDepositAmountByPercentage(
                                        "75%",
                                        formatUSTWithPostfixUnits(
                                          demicrofy(walletFunds.uluna)
                                        ),
                                        primaryWalletAddress,
                                        contractsInfo,
                                        pool.maxDepositAmount,
                                        pool.minDepositAmount,
                                        index,
                                        walletFunds
                                      )
                                    }
                                  >
                                    75%
                                  </div>
                                </div>
                                <div
                                  className={
                                    selectedDepositAmount === "Max"
                                      ? "depositAmountContainerActive"
                                      : "depositAmountContainer"
                                  }
                                >
                                  <div
                                    className="depositAmountItem"
                                    onClick={() =>
                                      updateDepositAmountByPercentage(
                                        "Max",
                                        formatUSTWithPostfixUnits(
                                          demicrofy(walletFunds.uluna)
                                        ),
                                        primaryWalletAddress,
                                        contractsInfo,
                                        pool.maxDepositAmount,
                                        pool.minDepositAmount,
                                        index,
                                        walletFunds
                                      )
                                    }
                                  >
                                    Max
                                  </div>
                                </div>
                              </div>

                              <div className="depositButtonItem">
                                <Button
                                  className="depositButton"
                                  disableRipple
                                  disableTouchRipple
                                  disableFocusRipple
                                  disabled={
                                    depositAmount === 0 ||
                                    validationMsg !== "" ||
                                    gasAmount <= 0
                                  }
                                  onClick={() =>
                                    depositUserAmount(
                                      index,
                                      pools,
                                      contractsInfo,
                                      primaryWalletAddress,
                                      depositAmount,
                                      gasAmount
                                    )
                                  }
                                >
                                  Deposit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Grid>

                    <Grid item sm={12} md={5}>
                      <div className="poolDetailsTable">
                        <Grid
                          container
                          spacing={3}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Grid
                            item
                            xs={4}
                            justifyContent="flex-start"
                            className="poolDetailsTableHeader"
                          >
                            Validators
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            justifyContent="center"
                            className="poolDetailsTableHeader"
                          >
                            Uptime
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            justifyContent="center"
                            className="poolDetailsTableHeader"
                          >
                            Self-Delegation
                          </Grid>
                          <Grid item xs={12}>
                            <Grid
                              container
                              spacing={3}
                              className="validatorDetails"
                            >
                              <Grid item xs={4} className="validatorHeader">
                                {pool.validators &&
                                  pool.validators.length > 0 &&
                                  pool.validators.map((validator: any) =>
                                    validator ? (
                                      <p
                                        className="validatorDetailsText"
                                        key={`validator-${validator.description.moniker}`}
                                      >
                                        {validator.description.moniker}
                                      </p>
                                    ) : null
                                  )}
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                className="validatorHeader"
                                alignItems="center"
                              >
                                {pool.validators &&
                                  pool.validators.length > 0 &&
                                  pool.validators.map((validator: any) =>
                                    validator ? (
                                      <p
                                        className="validatorDetailsText"
                                        key={`validator-${validator.description.moniker}-${validator.upTime}`}
                                      >
                                        {(
                                          parseFloat(validator.upTime) * 100
                                        ).toFixed()}
                                        %
                                      </p>
                                    ) : null
                                  )}
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                className="validatorHeader"
                                alignItems="center"
                              >
                                {pool.validators &&
                                  pool.validators.length > 0 &&
                                  pool.validators.map((validator: any) =>
                                    validator ? (
                                      <p
                                        className="validatorDetailsText"
                                        key={`validator-${validator.description.moniker}-${validator.selfDelegation.weight}`}
                                      >
                                        {(
                                          parseFloat(
                                            validator.selfDelegation.weight
                                          ) * 100
                                        ).toFixed(2)}
                                        %
                                      </p>
                                    ) : null
                                  )}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          ) : null}
        </div>
      </table>
    </Section>
  );
};

export default PoolInfo;
