import { Box, Button } from "@atoms/index";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import styles from "./RedirectToLunaXTable.module.scss";

export interface Props {
  withdrawFundsAction: any;
  isWithdrawFundsDialog: boolean;
}

export const RedirectToLunaXTable = (props: Props) => {
  return (
    <Box noPadding={true} className="p-5 flex-1 row-start-1 md:row-start-auto" gradientOutline>
      {props.isWithdrawFundsDialog && (
        <div className={styles.table_text}>
          <CheckCircleOutlineIcon />
          <span className={styles.table_item_alignment}>
            No SD token loss if equivalent Lunax is maintained
          </span>
        </div>
      )}
      <div className={styles.table_text}>
        <CheckCircleOutlineIcon />
        <span className={styles.table_item_alignment}>
          Staking Rewards auto compounded every day
        </span>
      </div>
      <div className={styles.table_text}>
        <CheckCircleOutlineIcon />
        <span className={styles.table_item_alignment}>
          Get Airdrops every Tuesday
        </span>
      </div>
      <div className={styles.table_text}>
        <CheckCircleOutlineIcon />
        <span className={styles.table_item_alignment}>
          Get LP fees for providing Lunax {"<>"} Luna LP
        </span>
      </div>
      <div>
        <Button
          onClick={() => {
            props.withdrawFundsAction(true);
          }}
          variant={"solid"}
          size={"large"}
          parentClassName={
            props.isWithdrawFundsDialog
              ? styles.button_withdraw_funds
              : styles.button_withdraw_rewards
          }
        >
          Get LunaX
        </Button>
      </div>
    </Box>
  );
};
