import React from "react";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const OutlinedButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const { style, ...rest } = props;
  return (
    <button
      style={{
        background: "#111111",
        boxShadow: "0px 4px 8px 0px #00000099",
        borderRadius: "10px",
        border: "1px solid #f04adc",
        color: "#fff",
        padding: "0.6em 2em",
        fontWeight: 500,
        margin: "0.5em 0 0em 2em",
        ...(style || {}),
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default OutlinedButton;
