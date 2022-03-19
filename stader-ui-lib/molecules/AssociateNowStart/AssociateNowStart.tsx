import React from "react";
import { Typography, Button } from "@atoms/index";
import { LIQUID_NATIVE_TOKEN_LABEL } from "@constants/constants";
import styles from "./AssociateNowStart.module.scss";

interface AssociateNowStartProps {
  onClickAssociate: () => void
}

const AssociateNowStart:React.FC<AssociateNowStartProps> = (props) => {
  return <>
    <Typography variant={"body1"} className={styles.text}>
      To undertake staking and obtain {LIQUID_NATIVE_TOKEN_LABEL},<br/> you must first associate {LIQUID_NATIVE_TOKEN_LABEL} with your account.
    </Typography>
    <Button variant={"solid"} onClick={props.onClickAssociate}>Associate now</Button>
  </>
}

export default AssociateNowStart;