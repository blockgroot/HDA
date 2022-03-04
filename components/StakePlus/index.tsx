// kept as a dependency of stader-ui-lib
// for representational purpose
export type ValidatorInfo = {
  operatorAddress: string,
  name: string,
  apr: string,
  uptime: string,
  commission: string,
  votingPower: string,
}

export type StakeContractInfo = {
  stakeContractAddress: string,
  operatorAddress: string
}

export type ValidatorStakingInfoMap = { [validator: string]: ValidatorInfo };
