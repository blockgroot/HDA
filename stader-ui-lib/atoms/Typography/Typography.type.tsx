import React, {
  ComponentType,
  ReactComponentElement,
  ReactElement,
  ReactNode,
} from "react";

export enum TypographyVariant {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  body1 = "body1",
  body2 = "body2",
  body3 = "body3",
  caption1 = "caption1",
  caption2 = "caption2",
}

export enum TypographyDefaultVariantMapping {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  body1 = "p",
  body2 = "p",
  body3 = "p",
  caption1 = "span",
  caption2 = "span",
}

export type FontWeightType =
  | "light"
  | "normal"
  | "medium"
  | "semi-bold"
  | "bold";

export interface TypographyType extends React.ComponentPropsWithoutRef<any> {
  variant?: keyof typeof TypographyVariant;
  fontWeight?: FontWeightType;
  color?: "primary" | "secondary" | "textPrimary" | "textSecondary";
  component?: ComponentType | keyof JSX.IntrinsicElements;
}
