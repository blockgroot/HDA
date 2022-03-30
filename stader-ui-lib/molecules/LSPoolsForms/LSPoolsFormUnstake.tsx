import { Typography } from "../../atoms";
import styles from "./LSPoolsFormLaToLx.module.scss";

interface Props {}

function LSPoolsFormUnstake(props: Props) {
  return (
    <div className={styles.root}>
      <div className="flex height-full">
        <Typography variant={"body1"} fontWeight={"normal"}>
          Unstaking /Withdrawal will be available in V2 launch around July 2022
        </Typography>
      </div>
    </div>
  );
}

export default LSPoolsFormUnstake;
