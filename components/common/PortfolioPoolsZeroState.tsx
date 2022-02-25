import React from "react";
import { InfoOutlined } from "@material-ui/icons";
import SDButton from "./SDButton";
import Router from "next/router";

function PortfolioPoolsZeroState(props: any) {
	return (
		<div className="welcome-container w-100 my-3">
			<div className="welcome-content">
				<div className="zeroState">
					<div>
						<InfoOutlined className="infoIcon" />
					</div>
					<div className="zeroStateContent">
						<p className="header">You’ve not deposited any LUNA yet</p>
						<SDButton
							className="button"
							onClick={() => {
								Router.push("/pools");
							}}
							text="Deposit Now"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PortfolioPoolsZeroState;
