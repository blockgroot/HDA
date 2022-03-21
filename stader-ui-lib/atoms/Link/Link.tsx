import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import ArrowRightIcon from "../../assets/svg/arrow_right_blue.svg";
import styles from "./Link.module.scss";
import classNames from "classnames";
import NextLink from "next/link";

interface Props extends ComponentPropsWithoutRef<"a"> {
  children: ReactNode;
  variant?: "gradient";
  href: string;
}

export function Link({ children, variant, href, className, ...props }: Props) {
  const rootClasses = classNames(styles.root, className);
  const textClasses = classNames(styles.text, {
    ["text-gradient"]: variant === "gradient",
  });
  return (
    <NextLink href={href}>
      <a className={rootClasses} {...props}>
        <span className={textClasses}>{children}</span>
        {variant === "gradient" && (
          <img
            src={ArrowRightIcon}
            alt="Button"
            className={styles.arrow_icon}
          />
        )}
      </a>
    </NextLink>
  );
}

// export default Link;
