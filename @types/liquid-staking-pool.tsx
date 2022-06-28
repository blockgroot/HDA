import { TransactionType, WithdrawStatus } from "context/HashConnectProvider";

export type TvlType = {
  uNativeToken: number;
  valueInUSD: number;
  exchangeRate: number;
};

export type LSPoolProps = {
  exchangeRate: number;
  tvlLoading?: boolean;
  holding: number;
  handleStake: (amount: number) => void;
  handleUnstake: (amount: number, exchangeRate: number) => void;
  handleWithdraw: (index: number) => void;
  setTransactionStatus: (status: string) => void;
  transactionStatus: string;
  transactionType: TransactionType;
  withdrawStatus: WithdrawStatus;
};

export type ContractConfigType = {
  min_deposit: number;
  max_deposit: number;
  protocol_withdraw_fee: number;
};

export type LiquidStakingState = {
  total_staked: string;
  exchange_rate: string;
  last_reconciled_batch_id: number;
  current_undelegation_batch_id: number;
  last_undelegation_time: string;
  last_swap_time: string;
  last_reinvest_time: string;
  validators: string[];
  reconciled_funds_to_withdraw: string;
};
