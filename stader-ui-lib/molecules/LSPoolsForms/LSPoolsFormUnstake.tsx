import { Icon, Typography } from "../../atoms";
import styles from "./LSPoolsFormLaToLx.module.scss";

interface Props {}

function LSPoolsFormUnstake(props: Props) {
  return (
    <div className={styles.root}>
      <div
        className=" flex flex-center flex-column height-full"
        style={{ height: "80%" }}
      >
        <div className="speed_container">
          <Icon name="speed" width={20} height={20} className="" />
          <Icon name="speed_circle" width={60} height={60} className="" />
        </div>

        <div className="comming-soon_container">
          <Typography variant={"body1"} fontWeight={"normal"}>
            Unstake/ withdrawl functionality will be available with V2 product
            upgrade, expected around July
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default LSPoolsFormUnstake;
