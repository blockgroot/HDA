import React from "react";
import { Button, Tooltip } from "@material-ui/core";

function SDButton(props: any) {
	const disabledhelpertext =
		props.disabledhelpertext || "This button is disabled";

	// SHOW TOOLTIP with why this button was disabled
	if (props.disabled) {
		return (
			<Tooltip title={disabledhelpertext} style={{}}>
				<div>
					<Button
						className="sdButtonDisabled"
						{...props}
						variant="contained"
						color="secondary"
						style={{ color: "#FFF" }}
					>
						{props.text}
					</Button>
				</div>
			</Tooltip>
		);
	}
	return (
		<Button
			className="sdButton"
			{...props}
			variant="contained"
			color="secondary"
			style={{ color: "#FFF" }}
		>
			{props.text}
		</Button>
	);
}

export default SDButton;
