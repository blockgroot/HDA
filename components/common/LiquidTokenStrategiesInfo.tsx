import { FC } from "react";
import {Grid, Tooltip} from "@material-ui/core";
import { BorderButton } from "@terra-dev/neumorphism-ui/components/BorderButton";
import { ADD_LIQUIDITY_APR, LT_SD_TOKENS_FARMED_PER_DAY, urls } from "../../constants/constants";
import {InfoOutlined} from "@material-ui/icons";

interface Props {
	lunaTokens: number;
	lunaXTokens: number;
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

const LiquidTokenStrategiesInfo: FC<Props> = ({ lunaTokens, lunaXTokens }) => {
	return (
		<>
			<Grid container>
				<Grid item xs={12}>
					<p className="strategiesInfoHeader">Liquidity Pool</p>
					<p className="strategiesInfoDescription gradientText">
						Deposit to LP pool to earn SD rewards
					</p>
				</Grid>
				<Grid xs={12}>
					<div className="strategiesInfoCard">
						<div className="strategiesInfoLogos">
							<img src={"/static/lunax.png"} alt={"lunax"} className="logo" />
							<img src={"/static/luna.png"} alt={"luna"} className="logo" />
						</div>

						<p className="strategiesInfoTitle">
						<p className="strategiesInfoAPYText"><b>My LP Holdings</b></p>
							{lunaXTokens.toFixed(6)} LunaX - {lunaTokens.toFixed(6)} LUNA
						</p>
						<div className="strategiesInfoAPY">
							<p className="strategiesInfoTitle">
								APR
							</p>
							&nbsp;&nbsp;&nbsp;
							<p className="strategiesInfoAPYPercentage">{ADD_LIQUIDITY_APR}%</p>
							<Tooltip className="strategiesInfoTitle"
								title={
									"Average 48 hrs swap fees + Coinlist sale price of SD tokens"
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
						</div>
						<hr className="strategiesInfoDivider" />
						<div className="strategiesInfoRewards">
							<p className="strategiesInfoRewardsAmount">{LT_SD_TOKENS_FARMED_PER_DAY}</p>
							<p className="strategiesInfoRewardsText"> SD / day rewards</p>
						</div>
						<a
							href={urls.terraSwapProvide}
							target="_blank"
							rel="noreferrer"
							className="liquidityButton"
						>
							<span>{"Add Liquidity"}</span>
						</a>
						<a
							href={urls.terraSwapSwap}
							target="_blank"
							rel="noreferrer"
							className="liquidityButton"
						>
							<span>{"Swap"}</span>
						</a>
					</div>
				</Grid>
			</Grid>
		</>
	);
};

export default LiquidTokenStrategiesInfo;
