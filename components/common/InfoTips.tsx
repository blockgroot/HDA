import { InfoTooltip } from "@terra-dev/neumorphism-ui/components/InfoTooltip";
import { CommissionInfoTooltip, CommissionInfoTable } from "./VaultInfoTables";

export interface CommissionTooltipProps {
	description: string;
	validators: any;
}

export interface CommissionTableProps {
	validators: any;
}

// TODO: make this an iterator and the iterator is a prop
export const CommissionTooltip = ({
	description,
	validators,
}: CommissionTooltipProps) => (
	<InfoTooltip
		placement={"right"}
		style={{ margin: "16px 0 0 8px", fontSize: "16px" }}
	>
		<CommissionInfoTooltip description={description} validators={validators} />
	</InfoTooltip>
);

// TODO: make this an iterator and the iterator is a prop
export const CommissionTable = ({ validators }: CommissionTableProps) => (
	<InfoTooltip>
		<CommissionInfoTable validators={validators} />
	</InfoTooltip>
);
