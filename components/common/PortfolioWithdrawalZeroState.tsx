import React from "react";
import { InfoOutlined } from "@material-ui/icons";

function PortfolioWithdrawalZeroState(props: any) {
	return (
		<div className="welcome-container w-100">
			<div className="welcome-content">
				<div className="zeroState">
					<div>
						<InfoOutlined className="infoIcon" />
					</div>
					<div className="zeroStateContent">
						<p className="header">Nothing to withdraw</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PortfolioWithdrawalZeroState;
