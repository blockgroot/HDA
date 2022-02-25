export type AirdropsType = {
  anc: { amount: number; amountInLuna: number };
  mir: { amount: number; amountInLuna: number };
  mine: { amount: number; amountInLuna: number };
  vkr: { amount: number; amountInLuna: number };
};

export type AirdropsArrayType = {
  denom: string;
  amount: string;
  logo?: string;
};
