import classNames from "classnames";
import styles from "./Divider.module.scss";
interface DividerProps {
  color: "gradient" | "light";
  orientation?: "horizontal" | "vertical";
}

export default function Divider(props: DividerProps) {
  const { orientation = "horizontal" } = props;
  const { color } = props;
  const classes = classNames("", {
    "pink-gradient": color === "gradient",
    "bg-dark-200": color === "light",
    [styles.horizontal]: orientation === "horizontal",
    [styles.vertical]: orientation === "vertical",
  });
  return <div className={classes} />;
}

Divider.defaultProps = {
  color: "light",
};
