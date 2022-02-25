import classNames from "classnames";
import styles from "./Loader.module.scss";

type Props = {
  className?: string;
  text?: string;
  height?: number;
  width?: number;
  position?: "center";
};

export default function Loader({
  className,
  text,
  height,
  width = 240,
  position = "center",
}: Props) {
  const classes = classNames(
    "",
    {
      [styles.position_center]: position === "center",
    },
    className
  );
  return (
    <div className={classes}>
      <img
        src={"/static/loader.gif"}
        alt="loader"
        width={width}
        height={height}
      />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}
