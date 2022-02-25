export interface CommissionInfoTooltipProps {
	description: string;
	validators: any;
}

export interface CommissionInfoTableProps {
	validators: any;
}

export const CommissionInfoTooltip = ({
	description,
	validators,
}: CommissionInfoTooltipProps) => (
	<div
		style={{
			fontFamily: "'Montserrat', sans-serif !important",
			padding: "0 24px",
			margin: "24px 0",
			width: 224,
			background: "#1E1E1E",
			borderRadius: 20,
			// boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
		}}
	>
		<div style={{ padding: "8px 0", borderBottom: "1px solid #3E3E3E" }}>
			<p
				style={{
					fontWeight: 600,
					fontSize: 12,
					lineHeight: "14px",
				}}
			>
				{description}
			</p>
		</div>
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				marginBottom: 16,
				padding: "8px 0",
			}}
		>
			<div>
				<p style={{ fontWeight: 700, fontSize: 16, lineHeight: "20px" }}>
					Validator
				</p>

				<div>
					{validators.map((validator: any) => (
						<p
							style={{ fontWeight: 500, fontSize: 14, lineHeight: "16px" }}
							key={validator.name}
						>
							{validator.name}
						</p>
					))}
				</div>
			</div>
			<div>
				<p style={{ fontWeight: 700, fontSize: 16, lineHeight: "20px" }}>
					Allocation
				</p>

				<div style={{ textAlign: "center" }}>
					{validators.map((validator: any) => (
						<p
							style={{ fontWeight: 500, fontSize: 14, lineHeight: "16px" }}
							key={validator.name}
						>
							{validator.allocation}
						</p>
					))}
				</div>
			</div>
		</div>
	</div>
);

// TODO: make this an iterator and the iterator is a prop
export const CommissionInfoTable = ({
	validators,
}: CommissionInfoTableProps) => (
	<div
		style={{
			fontFamily: "'Montserrat', sans-serif !important",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "0 24%",
			margin: "24px 0",
		}}
	>
		<div>
			<p style={{ fontWeight: 700, fontSize: 16, lineHeight: "20px" }}>
				Validator
			</p>

			<div style={{ textAlign: "center" }}>
				{validators.map((validator: any) => (
					<p
						style={{ fontWeight: 500, fontSize: 14, lineHeight: "16px" }}
						key={validator.name}
					>
						{validator.name}
					</p>
				))}
			</div>
		</div>
		<div>
			<p style={{ fontWeight: 700, fontSize: 16, lineHeight: "20px" }}>
				Allocation
			</p>

			<div style={{ textAlign: "center" }}>
				{validators.map((validator: any) => (
					<p
						style={{ fontWeight: 500, fontSize: 14, lineHeight: "16px" }}
						key={validator.name}
					>
						{validator.allocation}
					</p>
				))}
			</div>
		</div>
	</div>
);
