import React from "react";
import { Grid } from "@material-ui/core";

import { InfoOutlined } from "@material-ui/icons";
import { urls } from "../../constants/constants";
import { lunaFormatter } from "../../utils/CurrencyHelper";
import GradientBtnWithArrow from "../common/GradientLinkWithArrow";
import YellowInfoText from "../common/YellowInfoText";

interface Props {
  isLiquidStaking?: boolean;
  totalFarmedRewards: any;
  userFarmedRewards: any;
}

const liquidStakingSDPrice = "$ 0.73";

function CommunityFarming({
  isLiquidStaking,
  totalFarmedRewards,
  userFarmedRewards,
}: Props) {
  const dec07 = new Date("2021-12-07T12:00:00").getTime();
  const today = new Date().getTime();
  const tokenFarmed = (
    Math.floor((today - dec07) / (1000 * 3600 * 24)) * 25000
  ).toFixed(0);

	return (
		<div className="myPortfolioContainer">
			<Grid container spacing={4}>
				<Grid item xs={12} md={5} style={{ minWidth: "350px" }}>
					<div className="portfolioCardTokens">
						<div className="portfolioCard portfolioCardTokenDetails justify-content-between">
							<div className="portfolioTokensInfo">
								<img
									src={"/static/stader_logo.svg"}
									alt="logo"
									height={55}
									width={55}
									style={{ marginLeft: "-15px"}}
								/>
								<div className="portfolioTokens">
									<div>
										<div className="d-flex align-items-end position-relative">
											<p className="portfolioTokenAmount mb-1">
												{!isLiquidStaking
													? lunaFormatter(
															userFarmedRewards.totalSdTokens
													  ).toLocaleString()
													: userFarmedRewards.totalSdTokens.toFixed(6)}
											</p>
										</div>
										{isLiquidStaking && <p className="portfolioTokenTitle">My SD Tokens</p>}
										{!isLiquidStaking && (
											<p className="portfolioTokenTitle" style={{ fontWeight: 700 }}>
												Final SD Tokens Farmed
											</p>
										)}
									</div>
								</div>
								<div className="portfolioTokens flex-nowrap align-items-start justify-content-start">
									{!isLiquidStaking ? (
										<div>
											<div className="text-white">
												<h6 style={{ fontWeight: 500 }}>Details</h6>
												<p className="m-0" style={{ fontSize: "14px" }}>
													As communicated earlier, users who have completely undelegated Luna before Jan 20th 2022 will not receive any SD rewards.
												</p>
												<GradientBtnWithArrow
													onClick={() => window.open(urls.cfAnnouncementLink, "_blank")}
													className="m-0 portfolioInfoText gradientText"
												>
													Learn more
												</GradientBtnWithArrow>
											</div>
										</div>
									) : (
											<>
											<InfoOutlined className="portfolioInfoIcon" />
												<p className="mb-0 ms-2 portfolioInfoText gradientText">
													SD Rewards are distributed every Tuesday based on two
													random snapshots taken in the previous week.
												</p>
											</>
									)}
								</div>
							</div>
						</div>
					</div>
				</Grid>
			
			</Grid>
		</div>
	);
}

export default CommunityFarming;
