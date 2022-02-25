import { defaultContractAddress } from "@constants/common";
import { LiquidStakingState } from "@types_/liquid-staking-pool";
import {
  SPDepositUndelegationModalProps,
  SPWithdrawModalProps,
} from "@types_/portfolio";

export const defaultWithdrawProps: Omit<SPWithdrawModalProps, "onClose"> = {
  poolsContractAddress: defaultContractAddress,
  title: "",
  amount: 0,
  poolId: -1,
  undelegationBatchId: -1,
  undelegationId: -1,
  open: false,
};

export const defaultDepositUndelegationProps: Omit<
  SPDepositUndelegationModalProps,
  "onClose"
> = {
  poolId: -1,
  maxAmount: 0,
  protocolFee: 0,
  title: "",
  contractAddress: defaultContractAddress,
  open: false,
};

export const defaultLiquidStakingState: LiquidStakingState = {
  total_staked: "",
  exchange_rate: "",
  current_undelegation_batch_id: 0,
  last_reconciled_batch_id: 0,
  last_undelegation_time: "",
  last_swap_time: "",
  last_reinvest_time: "",
  validators: [],
  reconciled_funds_to_withdraw: "",
};
