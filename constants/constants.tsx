import { config } from "config/config";

export const LIQUID_NATIVE_TOKEN_LABEL = "HBARX";
export const NATIVE_TOKEN_LABEL = "HBAR";

export const tvlCap = {};

// How do I provide dynamic tooltips
export const tooltips = {};

export const urls = {
  faq: "https://docs.staderlabs.com/stader-hbar-staking/faqs",
  termsOfService:
    "https://staderlabs.notion.site/Stader-Terms-of-Service-af2b3b2aa4c942eea76e4857faa248e4",
};

export const transactionsTypeMap = {};

export const transactionsStatusMap = {};

export const NATIVE_TOKEN_MULTIPLIER = 100000000;

export const emissionRate = 300000 * NATIVE_TOKEN_MULTIPLIER; //Per day
export const stakeTransactionFee = 1 * NATIVE_TOKEN_MULTIPLIER;
export const version = 1.0;
export const apiPath = "api/v1/";
export const tokenLabel = LIQUID_NATIVE_TOKEN_LABEL;
export const precision = 4; //0.0001
export const transactionFees = 1; //1 hbar
export const NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS = precision;
export const NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS = 9;

export const bannerText = `Launch Phase 1: No limit on transaction value, emission rate is 300k   ${
  emissionRate / NATIVE_TOKEN_MULTIPLIER
} HBAR per day.`;

export const gtmId = "GTM-W2PZ7KX";
