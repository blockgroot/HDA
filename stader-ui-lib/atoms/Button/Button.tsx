import { ButtonType } from "./Button.type";
import classNames from "classnames";
import styles from "./Button.module.scss";

function Button(props: ButtonType) {
  const {
    children,
    variant,
    size,
    fullWidth,
    disabled,
    icon,
    childClassName,
    parentClassName,
    className,
    ...others
  } = props;

  const iconClass = classNames("inline mr-2.5");

  const parentClasses = classNames(
    {
      "inline-block": !fullWidth,
      block: fullWidth,
      "opacity-25": disabled,
      "bg-dark-200 rounded-10 shadow-block-button": variant === "block",
      "bg-dark-200  rounded-2xl": variant === "flat",
    },
    parentClassName
  );

  const childClasses = classNames(
    "text-white flex items-center justify-center",
    styles.button,
    {
      [styles.button_small]: size === "small",
      // "w-full px-5": variant !== "block",
      "px-4": variant === "block",
      "bg-transparent": variant === "solid",
      "bg-dark": variant === "outlined",
      [styles.button_outline]: variant === "outlined",
      "pink-gradient": variant === "solid",
    },
    childClassName,
    parentClasses,
    className
  );

  const iconElement = () => {
    return icon ? <div className={iconClass}>{icon}</div> : null;
  };

  return (
    <button className={childClasses} disabled={disabled} {...others}>
      {iconElement()} {children}
    </button>
  );
}

Button.defaultProps = {
  variant: "outlined",
  size: "normal",
};

export default Button;

export function ButtonOutlined(props: ButtonType) {
  const { children, ...others } = props;
  return (
    <Button {...others} variant={"outlined"}>
      {children}
    </Button>
  );
}

export function ButtonSolid(props: ButtonType) {
  const { children, ...others } = props;
  return (
    <Button {...others} variant={"solid"}>
      {children}
    </Button>
  );
}

export function ButtonBlock(props: ButtonType) {
  const { children, ...others } = props;
  return (
    <Button {...others} variant={"block"}>
      {children}
    </Button>
  );
}
