import SPValidatorRowHead from "@organisms/SPValidatorRowHead/SPValidatorRowHead";
import { useState } from "react";
import { StakeContractInfo, ValidatorStakingInfoMap } from "../../../components/StakePlus";
import SPValidatorTableHead from "../../molecules/SPValidatorTableHead/SPValidatorTableHead";
import styles from "./SPValidatorTable.module.css";

export interface Props {
  validatorStakingInfoMap: ValidatorStakingInfoMap;
  stakeContractInfo: StakeContractInfo;
}

export default function SPValidatorTable(props: Props) {
  const [openPoolBody, setOpenPoolBody] = useState<{
    open: boolean;
    index: number | null;
  }>({ open: false, index: null });

  const setQueryParam = (validator: string) => {
    const url = window.location.pathname;
    window.location.replace(`${url}?validator=${validator}`);
  };

  const toggleOpen = (index: number) => () => {
    setOpenPoolBody((prev) => {
      if (prev.open && index === prev.index) {
        return { open: false, index: null };
      } else {
        return { open: true, index: index };
      }
    });
  };

  return (
    <div className={styles.table}>
      <div className={styles.head}>
        <SPValidatorTableHead
          validatorStakingInfoMap={props.validatorStakingInfoMap}
        />
      </div>
      <SPValidatorRowHead
        onClick={toggleOpen(0)}
        setQueryParam={setQueryParam}
        openBody={openPoolBody.open && openPoolBody.index === 0}
        validatorInfo={props.validatorStakingInfoMap}
        topValidator={props.validatorStakingInfoMap[props.stakeContractInfo.operatorAddress]}
      />
    </div>
  );
}
