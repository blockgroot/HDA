import React from "react";
import { Typography, Button, SuccessAnimation } from "@atoms/index";
import { LIQUID_NATIVE_TOKEN_LABEL } from "@constants/constants";
import styles from "./AssociateNowComplete.module.scss";

interface AssociateNowStartProps {
  onClickStartStaking: () => void
}

const AssociateNowComplete:React.FC<AssociateNowStartProps> = (props) => {
  return <>
    <SuccessAnimation height={100} width={100} className={'mb-5'} />
    <Typography variant={"body1"} className={styles.text}>
      {LIQUID_NATIVE_TOKEN_LABEL} has been successfully associated with
      your account!
    </Typography>
    <Button variant={"solid"} onClick={props.onClickStartStaking}>Start Staking</Button>
  </>
}

export default AssociateNowComplete;