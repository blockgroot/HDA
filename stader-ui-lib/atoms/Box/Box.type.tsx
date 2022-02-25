import React from "react";

export interface BoxProps extends React.ComponentPropsWithoutRef<"div"> {
  noShadow?: boolean;
  noPadding?: boolean;
  noBorderRadius?: boolean;
  component?: any;
  gradientBorderHover?: boolean;
  parentClassName?: string;
  childClassName?: string;
  gradientOutline?: boolean;
}
