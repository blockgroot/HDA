export const LIQUID_NATIVE_TOKEN_LABEL = "HbarX";
export const NATIVE_TOKEN_LABEL = "Hbar";
export const NATIVE_TOKEN_INPUT_MAXIMUM_DECIMAL_POINTS = 6;
export const NATIVE_TOKEN_INPUT_MAXIMUM_INTEGER_POINTS = 6;

export const tvlCap = {
  limit: 200000,
  reOpen: "Nov 23, 1 PM UTC",
};

export const poolsDetails = {
  "Blue Chip": {
    description: "Highest performance validators.",
    tags: ["Uptime > 99.90%", "> 6 months active"],
    faq: "https://staderlabs.notion.site/Stader-Stake-Pools-FAQs-05baa5bf225a41b0a149531690a89957",
  },
  Community: {
    description: "Validators contributing to Terra community.",
    tags: ["Uptime > 99.85%", "Community growth"],
    faq: "https://staderlabs.notion.site/Stader-Stake-Pools-FAQs-05baa5bf225a41b0a149531690a89957",
  },
  "Airdrops Plus": {
    description: "Validators providing their protocol tokens.",
    tags: ["Uptime > 99.85%", "Validator protocol airdrops"],
    faq: "https://staderlabs.notion.site/Stader-Stake-Pools-FAQs-05baa5bf225a41b0a149531690a89957",
  },
};

// How do I provide dynamic tooltips
export const tooltips = {
  poolsAPR:
    "Average 48 hour APR for the pool including airdrops. Updated every 48 hours.",
  validatorAPR:
    "Average 48 hour APR of the validator including autocompounding of rewards, Updated every 48 hours.",
  apr: "Combined APR of Pool & Reward strategy",
  aprAirdrops: "APR including airdrops measured based on the last 48 hours.",
  totalHoldings: `Total value of Deposits & Rewards calculated in ${NATIVE_TOKEN_LABEL}. Airdrops not included.`,
  uptime: "Percentage of time a validator was responsive over last 30 days",
  commission: "The commission rates charged to delegators",
  rewards: "Rewards accumulated on staking",
  deposits: "Amount staked in the pool",
  undelegated: "Funds in unbonding period",
  retainRewards: "Rewards accrued in the pool are retained for quick claiming.",
  autoCompounding: "Rewards accrued in the pool are autocompounded.",
  insured: "The fee is borne by Stader",
  decentralization: "Your stake is spread across multiple validators",
  slashing:
    "No slashing in the last 3 months & Validator performance is constantly monitored.",
  withdrawals: "Release time will be shared within 3 days of undelegation.",
  votingPower:
    "The voting power the validator has in terra governance proposals",
};

export const urls = {
  telegram: "https://t.me/staderlabs",
  medium: "https://blog.staderlabs.com/",
  discord: "http://discord.gg/xJURAhSmav",
  twitter: "https://twitter.com/staderlabs",
  subscribe: "https://staderlabs.typeform.com/to/o6S6UBT2",
  termsOfService:
    "https://staderlabs.notion.site/Stader-Terms-of-Service-af2b3b2aa4c942eea76e4857faa248e4",
  faq: "https://staderlabs.notion.site/Stader-Liquid-Token-LunaX-FAQs-df6fedeb39524f47a10e094572fd8479",
  faqWithdrawalFee:
    "https://staderlabs.notion.site/Stader-Stake-Pools-FAQs-05baa5bf225a41b0a149531690a89957",
  faqRewards: "https://staderlabs.com/faq#luna_rewards_question",
  faqLiquidStaking:
    "https://staderlabs.notion.site/Stader-Liquid-Token-LunaX-FAQs-df6fedeb39524f47a10e094572fd8479",
  faqPlainStaking:
    "https://staderlabs.notion.site/Stader-Stake-Pools-FAQs-05baa5bf225a41b0a149531690a89957",
  faqCommunityFarming:
    "https://staderlabs.notion.site/Stader-Stake-Pools-FAQs-05baa5bf225a41b0a149531690a89957",
  app: "https://alpha.staderlabs.com/",
  faqBanner:
    "https://www.notion.so/Stader-FAQ-f72944dd325644999add904c45857f88#46fe81a602d7451892bd2f410d4810b0",
  faqDeposits:
    "https://www.notion.so/Stader-FAQ-f72944dd325644999add904c45857f88#ada20d095a784b8d961481fbe4026b50",
  terraSwapProvide: "https://app.terraswap.io/swap?to=&type=provide&from=uluna",
  terraSwapSwap: "https://app.terraswap.io/swap#Swap",
  cfAnnouncementLink:
    "https://blog.staderlabs.com/cf-announcement-sd-token-vesting-562944044639",
};

export const transactionsTypeMap = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW_AIRDROPS: "WITHDRAW_AIRDROPS",
  WITHDRAW_REWARDS: "WITHDRAW_REWARDS",
  UNDELEGATE_DEPOSIT: "UNDELEGATE_DEPOSIT",
  UNDELEGATE_REWARDS: "UNDELEGATE_REWARDS",
  WITHDRAW_FUNDS: "WITHDRAW_FUNDS",
  WITHDRAW_UNDELEGATED_REWARDS: "WITHDRAW_UNDELEGATED_REWARDS",
};

export const transactionsStatusMap = {
  DEPOSIT: "Deposited",
  WITHDRAW_AIRDROPS: "Withdrawn Airdrops",
  WITHDRAW_REWARDS: "Withdrawn Rewards",
  UNDELEGATE_DEPOSIT: "Undelegated",
  UNDELEGATE_REWARDS: "Undelegated Rewards",
  WITHDRAW_FUNDS: "Withdrawn Funds",
  WITHDRAW_UNDELEGATED_REWARDS: "Withdrawn Rewards",
};

export const defaultAirdrops = [
  {
    denom: "anc",
    amount: "0",
  },
  {
    denom: "mir",
    amount: "0",
  },
  {
    denom: "mine",
    amount: "0",
  },
  {
    denom: "vkr",
    amount: "0",
  },
  {
    denom: "orion",
    amount: "0",
  },
  {
    denom: "twd",
    amount: "0",
  },
];

export const airdropsAPR = 0.61;
export const ustFee = 0.5;
export const ustConvertToLiquidNativeToken = 0.75;
export const ustFeeStaking = 0.9;
export const ustFeeStrategies = 0.2;

export const ADD_LIQUIDITY_APR = 28.98;

export const GET_ALL_USER_TRANSACTION_URL = "getAllUserTransactions/";
export const SAVE_TRANSACTION_URL = "saveTransaction/";
export const UPDATE_USER_DATA_URL = "updateUserData/";
export const GET_NATIVE_TOKEN_PRICE_URL = "getNativeTokenPrice/";
export const GET_TOKEN_PRICE_IN_NATIVE_TOKEN_URL =
  "getTokenPriceInNativeToken/";
export const GET_TOTAL_FARMED_REWARDS = "getTotalFarmedRewards/";
export const GET_USER_FARMED_REWARDS = "getUserFarmedRewards/";
export const GET_USER_SD_REWARDS = "stakingApiGetUserSdRewards/";
export const GET_KVY_APR_BY_POOL = "kyvGetAprByPool/";
export const GAS_PRICES_URL = "https://fcd.terra.dev/v1/txs/gas_prices";

export const messageMemo = "STADER";
export const REDIRECT_TO_LIQUID_NATIVE_TOKEN =
  "STADER_REDIRECT_TO_LIQUID_NATIVE_TOKEN";
export const WITHDRAW_FUNDS = "STADER_WITHDRAW_FUNDS";

export const PAGE_LOADER_TEXT = "Please wait while we set things up for you...";

export const LT_SD_TOKENS_FARMED_PER_DAY = "15,000";
export const LT_BANNER_TEXT = `Deposit to ${LIQUID_NATIVE_TOKEN_LABEL} <> ${NATIVE_TOKEN_LABEL} LP pool to earn upto ${LT_SD_TOKENS_FARMED_PER_DAY} SD tokens per day!`;

// Liquid staking constants
export const NATIVE_TOKEN_MULTIPLIER = 100000000;
export const tokenLabel = LIQUID_NATIVE_TOKEN_LABEL;
export const GET_USER_STAKING_REWARDS = "stakingApiGetUserRewards/";
export const GET_USER_STAKING_AIRDROPS = "stakingApiGetUserAirdrops/";

export const LINK_LIQUID_NATIVE_TOKEN_OVER_NATIVE_TOKEN =
  "https://blog.staderlabs.com/lunax-the-only-luna-you-need-1f48b23fdb00";
