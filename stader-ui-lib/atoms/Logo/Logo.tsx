import React from "react";
import classNames from "classnames";

interface LogoProps extends React.ComponentPropsWithoutRef<"img"> {
  withTitle?: boolean;
}

export default function Logo(props: LogoProps) {
  const { width, className, alt, withTitle, ...others } = props;
  const classes = classNames("", className);
  return (
    <img
      src={
        withTitle ? "/static/Stader_logo_title.svg" : "/static/stader_logo.svg"
      }
      {...others}
      className={classes}
      width={width}
      alt={alt || "Stader"}
    />
  );
}
