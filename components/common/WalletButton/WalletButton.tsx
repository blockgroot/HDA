import { FC, ButtonHTMLAttributes } from "react";
import {
	demicrofy,
	formatUSTWithPostfixUnits,
	truncate,
} from "@anchor-protocol/notation";
// import { IconSpan } from "@terra-dev/neumorphism-ui/components/IconSpan";

import wallet_icon from "../../../assets/svg/wallet_icon.svg";
import greenTick from "../../../assets/svg/check_success.svg";
import styles from "./WalletButton.module.scss";
import { NATIVE_TOKEN_LABEL } from "@constants/constants";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	walletAddress?: string | null;
	walletFunds?: any;
    children?: React.ReactNode;
}

const WalletButton: FC<Props> = ({
	walletAddress,
	walletFunds,
    children,
	...buttonProps
}) => {
	return (
		<button {...buttonProps} className={styles.walletButton}>
			<span className={styles.btnDisplay}>
				<span className={styles.walletIcon}>
					<img alt="img" src={wallet_icon} height={20} width={20} />
				</span>
				{walletAddress && <img alt="" src={greenTick} width="10" className={styles.connectedIcon} />}
				<div className={styles.btnContent}>
					{walletAddress && <span className={styles.walletAddress}>{truncate(walletAddress)}</span>}
					{walletFunds && <div className={styles.walletBalance}>
						{walletFunds.uNativeToken
							? formatUSTWithPostfixUnits(demicrofy(walletFunds.uNativeToken))
							: 0
						}{" "}
						<span style={{ fontSize: 12 }}>{NATIVE_TOKEN_LABEL}</span>
					</div>}
					{children}
				</div>
			</span>
		</button>
	);
};

export default WalletButton;
