import {
  TypographyDefaultVariantMapping,
  TypographyType,
  TypographyVariant,
} from "./Typography.type";
import classNames from "classnames";
import React from "react";
import styles from "./Typography.module.scss";

export default function Typography(props: TypographyType) {
  const {
    variant = TypographyVariant.body1,
    fontWeight,
    className,
    children,
    color = "textPrimary",
    component,
    ...others
  } = props;

  const classes: string = classNames(
    styles.root,
    {
      [styles.h1]: variant === TypographyVariant.h1,
      "text-h2": variant === TypographyVariant.h2,
      [styles.h3]: variant === TypographyVariant.h3,
      [styles.body1]: variant === TypographyVariant.body1,
      [styles.body2]: variant === TypographyVariant.body2,
      "text-body3": variant === TypographyVariant.body3,
      "text-caption1": variant === TypographyVariant.caption1,
      "text-caption2": variant === TypographyVariant.caption2,
      "font-light": fontWeight === "light",
      "font-normal": fontWeight === "normal",
      "font-medium": fontWeight === "medium",
      "font-semibold": fontWeight === "semi-bold",
      "font-bold": fontWeight === "bold",
      "text-white": color === "textPrimary",
      "text-light-800": color === "textSecondary",
      "text-primary": color === "primary",
      "text-secondary": color === "secondary",
    },
    className
  );

  const Component = component || TypographyDefaultVariantMapping[variant];

  return (
    <Component className={classes} {...others}>
      {children}
    </Component>
  );
}

Typography.defaultProps = {
  variant: TypographyVariant.body1,
  fontWeight: "normal",
  color: "textPrimary",
};
