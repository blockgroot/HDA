import React, { ReactElement } from "react";

export interface ButtonType extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "outlined" | "solid" | "block" | "flat";
  size?: "small" | "normal" | "large";
  fullWidth?: boolean;
  icon?: ReactElement;
  childClassName?: string;
  parentClassName?: string;
}
