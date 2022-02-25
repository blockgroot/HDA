import { FC } from "react";
import styles from "./Tag.module.scss";

const Tag: FC = (props) => {
  return <div className={styles.root}>{props.children}</div>;
};

export default Tag;
