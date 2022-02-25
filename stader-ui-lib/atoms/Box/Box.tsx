import classNames from "classnames";
import React from "react";
import { BoxProps } from "./Box.type";
import styles from "./Box.module.scss";

export default function Box(props: BoxProps) {
  const {
    component: Component,
    children,
    noShadow,
    noBorderRadius,
    noPadding,
    childClassName,
    gradientBorderHover,
    parentClassName,
    className,
    gradientOutline,
    ...others
  } = props;
  const gradientHoverClass = styles.gradient_hover;
  const gradientOutlineClass = styles.gradient_outline;

  const mainClass = classNames(
    "bg-dark-600",
    {
      "rounded-3xl": !noBorderRadius,
      "border border-dark-200": !gradientOutline || !gradientBorderHover,
      "p-5": !noPadding,
      "shadow-box": !noShadow,
      [gradientHoverClass]: gradientBorderHover,
      [gradientOutlineClass]: gradientOutline,
    },
    childClassName,
    className
  );

  return (
    <Component className={mainClass} {...others}>
      {children}
    </Component>
  );
}

Box.defaultProps = {
  noBorderRadius: false,
  noShadow: false,
  noPadding: false,
  component: "div",
};
