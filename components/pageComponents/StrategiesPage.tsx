import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Grid, Tooltip, Slider, Button } from "@material-ui/core";
import { WalletStatus } from "@terra-money/wallet-provider";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";

import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import InfoIcon from "@material-ui/icons/Info";

import { config } from "../../config/config";

import ArrowRight from "../../assets/svg/arrow_right.svg";
import PercentageIcon from "../../assets/svg/percentage.svg";
import BoltIcon from "../../assets/svg/bolt.svg";
import {
	messageMemo,
	PAGE_LOADER_TEXT,
	tooltips,
	ustFeeStrategies,
} from "../../constants/constants";
import { getContractByName } from "../../utils/contractFilters";
import { toUserReadableError } from "../../utils/ErrorHelper";
import Loader from "../common/Loader";
import { useSuccessDialog } from "../../dialogs/useSuccessDialog";
import StrategiesZeroState from "../common/StrategiesZeroState";
import withMediaQuery from "../../media_query";
import InfoPageMobile from "../common/InfoPageMobile";

interface Props {
	primaryWalletAddress?: string;
	terra?: any;
	wallet?: any;
	walletFunds?: any;
	walletStatus?: any;
	toggleConnectWallet?: any;
	mediaQuery: any;
}

function StrategiesPage({
	primaryWalletAddress,
	terra,
	wallet,
	walletStatus,
	toggleConnectWallet,
	mediaQuery,
}: Props) {
	const { query } = useRouter();

	const [isDeviceMobile, setIsDeviceMobile] = useState(false);
	const [spinner, setSpinner] = useState(true);
	const [canChangePortfolio, setCanChangePortfolio] = useState(false);
	const [userPortfolio, setUserPortfolio] = useState([
		{ strategy_id: 0, deposit_fraction: "0" },
		{ strategy_id: 1, deposit_fraction: "100" },
	]);
	const [autoCompoundingDepositFraction, setAutoCompoundingDepositFraction] =
		useState(100);
	const [retainRewardsDepositFraction, setRetainRewardsDepositFraction] =
		useState(0);
	const [contractsInfo, setContractsInfo] = useState<any[]>([]);
	const [errMsg, setErrMsg] = useState("");

	const [openSuccessDialog, successDialogElement] = useSuccessDialog();

	function setErrorMsgForFailure(
		errorMessage = "Something did not go right. Please try again!",
		timeout = 5000
	) {
		setErrMsg(errorMessage);
		setTimeout(() => {
			setErrMsg("");
		}, timeout);
	}

	const getContractsAndPoolDetails = useCallback(async (walletAddress) => {
		try {
			const contractAddress = config.contractAddresses.staderHub;
			const contracts = await terra.wasm.contractQuery(contractAddress, {
				get_all_contracts: {},
			});

			const sccAddress = getContractByName(contracts, "scc");

			const userInfo = await terra.wasm.contractQuery(sccAddress.addr, {
				get_user: { user: walletAddress },
			});

			if (
				userInfo.user.user_portfolio &&
				userInfo.user.user_portfolio.length > 0
			) {
				setUserPortfolio(userInfo.user.user_portfolio);
				userInfo.user.user_portfolio.forEach((strategy: any) => {
					if (strategy.strategy_id === 0) {
						setRetainRewardsDepositFraction(
							parseInt(strategy.deposit_fraction)
						);
					} else if (strategy.strategy_id === 1) {
						setAutoCompoundingDepositFraction(
							parseInt(strategy.deposit_fraction)
						);
					}
				});
			}

			setContractsInfo(contracts);
			setSpinner(false);
		} catch (err) {
			console.log("Error reported in fetching contracts" + err);
			setSpinner(false);
		}
	}, []);

	const refreshPage = () => {
		setSpinner(true);
		setTimeout(() => {
			getContractsAndPoolDetails(primaryWalletAddress);
		}, 5000);
		getContractsAndPoolDetails(primaryWalletAddress);
	};

	const updateUserPortfolio = async () => {
		const contractAddress = getContractByName(contractsInfo, "scc");
		const walletAddress = primaryWalletAddress || "";

		if (primaryWalletAddress && primaryWalletAddress !== "") {
			const msg = new MsgExecuteContract(walletAddress, contractAddress.addr, {
				update_user_portfolio: {
					user_portfolio: userPortfolio,
				},
			});

			try {
				let fee = await (terra &&
					terra.tx.estimateFee(primaryWalletAddress, [msg]));

				const tx = await wallet.post({
					msgs: [msg],
					fee: new StdFee(
						fee.gas,
						`${(ustFeeStrategies * 1000000).toFixed()}uusd`
					),
					memo: messageMemo,
				});

				if (!(!!tx.result && !!tx.result.txhash)) {
					throw Error("Failed to send transaction");
				} else {
					openSuccessDialog({
						refreshPage,
						autoCompoundingDepositFraction,
						retainRewardsDepositFraction,
					});
				}
			} catch (err: any) {
				console.log("Exception Thrown|" + err.toString());
				setErrorMsgForFailure(toUserReadableError(err.toString()));
			}
		}
	};

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

	const updateDepositFraction = (value: number, strategyId: number) => {
		let autoCompoundingFraction = 0;
		let retainRewardsFraction = 0;

		if (strategyId === 0) {
			retainRewardsFraction = value;
			autoCompoundingFraction = 100 - value;
		} else {
			retainRewardsFraction = 100 - value;
			autoCompoundingFraction = value;
		}

		const userPortfolio = [
			{
				strategy_id: 0,
				deposit_fraction: retainRewardsFraction.toString(),
			},
			{
				strategy_id: 1,
				deposit_fraction: autoCompoundingFraction.toString(),
			},
		];

		setUserPortfolio(userPortfolio);
		setAutoCompoundingDepositFraction(autoCompoundingFraction);
		setRetainRewardsDepositFraction(retainRewardsFraction);
	};

	const strategies = (
		<div
			className="strategiesContainer position-relative"
			style={{ flexGrow: 1 }}
		>
			{spinner || walletStatus === WalletStatus.INITIALIZING ? (
				<div>
					<Loader
						classes={"loaderContainer loaderContainer60"}
						loaderText={PAGE_LOADER_TEXT}
					/>
				</div>
			) : (
				<div>
					<div className="strategiesInfoHeader">
						<InfoIcon className="infoIcon" />
						<p className="strategiesInfoText">
							Reward strategy you select is applied for future rewards across
							all your pools.
						</p>
					</div>
					<Grid container spacing={4} className="strategiesDetails">
						<Grid item xs={12} md={8}>
							<div className="strategiesBreakUp">
								<div className="strategyBreakUpInfo strategyBreakUpInfoAutoCompounding">
									<p className="strategyBreakUpInfoHeader">
										Auto Compound Rewards
									</p>
									<div className="strategyBreakUpInfoDetails">
										<div className="strategiesBreakUpGroup">
											<div className="strategyBreakUpInfoItem">
												<img src={PercentageIcon} alt="rewards" />
												<p
													className="strategyBreakUpInfoItemText"
													style={{ minWidth: 220 }}
												>
													Stable coin rewards converted to Luna & All Luna
													rewards restaked.
												</p>
											</div>
										</div>

										<div className="strategyBreakUpInfoItem">
											<p className="strategyBreakUpValue">
												{autoCompoundingDepositFraction}%
											</p>
										</div>
									</div>
									<div className="strategyBreakUpSlider">
										<Slider
											value={autoCompoundingDepositFraction}
											onChange={(event, value) => {
												updateDepositFraction(value as number, 1);
											}}
											step={5}
											disabled={!canChangePortfolio}
											classes={{
												rail: "customSlider",
												track: "autoCompoundingTrack",
												thumb: canChangePortfolio
													? "customSliderThumb autoCompoundingThumb"
													: "customSliderThumb thumbNone autoCompoundingThumb",
											}}
										></Slider>
									</div>
								</div>
								<div className="strategyBreakUpInfo strategyBreakUpInfoRetainRewards m-0">
									<p className="strategyBreakUpInfoHeader">Retain Rewards</p>
									<div className="strategyBreakUpInfoDetails">
										<div className="strategiesBreakUpGroup">
											<div className="strategyBreakUpInfoItem">
												<img src={BoltIcon} alt="rewards" />
												<p
													className="strategyBreakUpInfoItemText"
													style={{ minWidth: 220 }}
												>
													Instant Rewards Withdrawal
												</p>
											</div>
										</div>

										<div className="strategyBreakUpInfoItem">
											<p className="strategyBreakUpValue">
												{retainRewardsDepositFraction}%
											</p>
										</div>
									</div>

									<div className="strategyBreakUpSlider">
										<Slider
											value={retainRewardsDepositFraction}
											onChange={(event, value) => {
												updateDepositFraction(value as number, 0);
											}}
											step={5}
											disabled={!canChangePortfolio}
											classes={{
												rail: "customSlider",
												track: "retainRewardsTrack",
												thumb: canChangePortfolio
													? "customSliderThumb retainRewardsThumb"
													: "customSliderThumb thumbNone retainRewardsThumb",
											}}
										></Slider>
									</div>
								</div>
								{canChangePortfolio ? (
									<p className="strategyBreakUpInfoText">
										Transaction fee of 0.2 UST will be charged to change
										Strategy
									</p>
								) : null}
								<div className="strategyConfirmButtonContainer">
									{canChangePortfolio ? (
										<Button
											className="confirmButton"
											disableRipple
											disableTouchRipple
											disableFocusRipple
											onClick={() => {
												updateUserPortfolio();
											}}
										>
											Confirm
										</Button>
									) : (
										<div
											className="changePortfolio"
											onClick={() => setCanChangePortfolio(true)}
										>
											<p className="text">Change Strategy</p>
											<img src={ArrowRight} alt="icon" />
										</div>
									)}
								</div>
							</div>
						</Grid>
					</Grid>
				</div>
			)}
			{successDialogElement}
		</div>
	);
	
	if (isDeviceMobile) {
		return (
			<div style={{margin: "0 20px"}}>
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
			{isDeviceMobile ? (
				<div>
					{" "}
					<InfoPageMobile />
				</div>
			) : primaryWalletAddress || walletStatus === WalletStatus.INITIALIZING ? (
				<div>{strategies}</div>
			) : (
				<div className="strategiesContainer">
					<StrategiesZeroState toggleConnectWallet={toggleConnectWallet} />
				</div>
			)}
		</div>
	);
}

export default withMediaQuery("(max-width:1024px)")(StrategiesPage);
