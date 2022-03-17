import { StakeContractInfo, ValidatorStakingInfoMap } from "../../../components/Stake";
import SPValidatorTable from "../../organisms/SPValidatorTable/SPValidatorTable";
import styles from "./SPValidators.module.scss";

export interface Props {
  validatorStakingInfoMap: ValidatorStakingInfoMap;
  stakeContractInfo: StakeContractInfo;
}

export default function SPValidators(props: Props) {
  const { validatorStakingInfoMap, stakeContractInfo } = props;

  return (
    <div>
      <div className={styles.table}>
        <SPValidatorTable validatorStakingInfoMap={validatorStakingInfoMap} stakeContractInfo={stakeContractInfo} />
      </div>
    </div>
  );
}
