import React from "react";
import MoreInfoIcon from "../../assets/svg/more_info_yellow.svg";

type PTagProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

const YellowInfoText: React.FC<PTagProps> = ({ children, ...props }) => {
  return (
    <p {...props}>
      <img src={MoreInfoIcon} alt="More info about signup" />
      <span style={{ marginLeft: "5px", color: "#E2B93B" }}>{children}</span>
    </p>
  );
};

export default YellowInfoText;
