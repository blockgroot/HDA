export type AirdropsType = {
  anc: { amount: number; amountInNativeToken: number };
  mir: { amount: number; amountInNativeToken: number };
  mine: { amount: number; amountInNativeToken: number };
  vkr: { amount: number; amountInNativeToken: number };
};

export type AirdropsArrayType = {
  denom: string;
  amount: string;
  logo?: string;
};
