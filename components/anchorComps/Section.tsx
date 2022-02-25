import { FC } from "react";

interface Props {
	className?: any;
}

const Section: FC<Props> = ({ children, className, ...sectionProps }) => {
	return (
		<section
			className={`NeuSection-root section-container ${className}`}
			{...sectionProps}
		>
			<div className="NeuSection-content">{children}</div>
		</section>
	);
};

export default Section;
