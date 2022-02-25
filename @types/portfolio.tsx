import { ContractAddressType } from "@types_/common";
import { LiquidStakingState } from "./liquid-staking-pool";

export type PortfolioSDPriceTotalType = {
  totalSdTokens: number | string;
  sdTokenPrice: number;
  totalRewards?: number;
};

export type PortfolioDataType = {
  total: number;
  deposits: number;
  total_rewards: number;
  pending_rewards: number;
  airdrops: AirdropsType;
};
export type AirdropNames = "anc" | "mir" | "mine" | "vkr" | "orion" | "twd";
export type AirdropsType = {
  anc: { amount: number; amountInLuna: number };
  mir: { amount: number; amountInLuna: number };
  mine: { amount: number; amountInLuna: number };
  vkr: { amount: number; amountInLuna: number };
  orion: { amount: number; amountInLuna: number };
  twd: { amount: number; amountInLuna: number };
};

export interface SPWithdrawModalProps {
  title: string;
  poolsContractAddress: ContractAddressType;
  amount: number;
  poolId: number;
  undelegationBatchId: number;
  undelegationId: number;
  onClose: () => void;
  open: boolean;
}

export interface SPDepositUndelegationModalProps {
  poolId: number;
  maxAmount: number;
  protocolFee: number;
  title: string;
  contractAddress: ContractAddressType;
  onClose: () => void;
  open: boolean;
}
