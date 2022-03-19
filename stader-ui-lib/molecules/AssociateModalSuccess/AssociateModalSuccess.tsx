import React from 'react';
import styles from './AssociateModalSuccess.module.scss';
import Icon from "@atoms/Icon/Icon";
import { Button, Typography } from "@atoms/index";
import { LIQUID_NATIVE_TOKEN_LABEL } from "@constants/constants";

interface AssociateModalSuccessProps {
  onClickStartStaking: () => void;
}
const AssociateModalSuccess:React.FC<AssociateModalSuccessProps> = (props) => {
  return <div className={styles.root}>
    <Icon name={"check_success_aqua"} height={100} width={100} className={'mb-5'} />
    <Typography variant={"body1"} className={styles.text}>
      {LIQUID_NATIVE_TOKEN_LABEL} has been successfully associated with
      your account!
    </Typography>
    <Button variant={"solid"} onClick={props.onClickStartStaking}>Start Staking</Button>
  </div>
}

export default AssociateModalSuccess;