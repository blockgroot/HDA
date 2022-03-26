import { Box, Button, Icon } from "@atoms/index";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import styles from "./WithdrawFundsTable.module.scss";

export interface Props {
  withdrawFundsAction: any;
  isWithdrawFundsDialog: boolean;
}

export const WithdrawFundTable = (props: Props) => {
  return (
    <Box noPadding={true} className="p-5 flex-1 md:relative">
      {props.isWithdrawFundsDialog && (
        <div className={styles.table_text}>
          <ReportProblemOutlinedIcon />
          <span className={styles.table_item_alignment}>
            50% of Unvested SD tokens
          </span>
        </div>
      )}
      <div className={styles.table_text}>
        <ReportProblemOutlinedIcon />
        <span className={styles.table_item_alignment}>No Staking rewards</span>
      </div>
      <div className={styles.table_text}>
        <ReportProblemOutlinedIcon />
        <span className={styles.table_item_alignment}>No Airdrops</span>
      </div>
      <div className={styles.table_text}>
        <ReportProblemOutlinedIcon />
        <span className={styles.table_item_alignment}>No LP benefit</span>
      </div>
      <div className="md:absolute md:bottom-5">
        <Button
          onClick={() => {
            props.withdrawFundsAction(false);
          }}
          variant={"solid"}
          size={"large"}
          className={styles.button_withdraw_funds}
        >
          Withdraw to wallet
        </Button>
      </div>
    </Box>
  );
};
