import React from "react";
import ArrowRightIcon from "../../assets/svg/arrow_right_blue.svg";

type PTagProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

const GradientBtnWithArrow: React.FC<PTagProps> = ({ children, ...props }) => {
  const { style, ...rest } = props;
  return (
    <p
      style={{
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "16px",
        display: "inline-block",
        marginLeft: "0.5em",
        ...(style || {}),
      }}
      {...rest}
    >
      <span className="gradientText" style={{ marginRight: "8px" }}>
        {children}
      </span>
      <img src={ArrowRightIcon} alt="Button" />
    </p>
  );
};

export default GradientBtnWithArrow;
