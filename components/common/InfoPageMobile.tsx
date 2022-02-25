import React from "react";
import welcome_wave from "../../assets/svg/welcome_wave.svg";
// TODO: move the styling to a style page

function InfoPageMobile() {
	return (
		<div className="welcome-container">
			<div className="welcome-content">
				<img src={welcome_wave} alt="welcome" />
				<h3 className="welcome-main-text">
					Hi there, welcome to the Stader community :)
				</h3>
				<div className="layout-row layout-align-space-between-center">
					<p className="welcome-sub-text">
						Stader is currently only available on Desktop, please access the
						Dapp on desktop. We will be adding a mobile version soon.
					</p>
				</div>
			</div>
		</div>
	);
}

export default InfoPageMobile;
