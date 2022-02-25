import React from "react";
import { InfoOutlined } from "@material-ui/icons";
import SDButton from "./SDButton";

function PortfolioZeroState(props: any) {
	return (
		<div className="welcome-container">
			<div className="welcome-content">
				<div className="zeroState">
					<div>
						<InfoOutlined className="infoIcon" />
					</div>
					<div className="zeroStateContent">
						<p className="header">Wallet not connected!</p>
						<p className="text">
							Please connect your wallet to manage your portfolio.
						</p>
						<SDButton
							className="button"
							onClick={() => {
								const element = document.getElementById("#connectbutton");
								element?.scrollIntoView({
									behavior: "smooth",
									block: "end",
									inline: "nearest",
								});
								props.toggleConnectWallet(true);
							}}
							text="Connect Wallet"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PortfolioZeroState;
