export type MutationResponseType = {
  message: string;
  success: boolean;
};

export type ContractAddressType = {
  addr: string;
  name: string;
};

export interface UndelegationType {
  create_time: string;
  est_release_time: string | null;
  reconciled: boolean;
  undelegated_tokens: string;
  undelegation_er: string;
  unbonding_slashing_ratio?: string;
  undelegated_stake?: string;
  batch_id: number;
  token_amount: string;
}
