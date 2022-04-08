export const mainnetConfig = {
  network: {
    name: "mainnet",
    url: "https://mainnet-public.mirrornode.hedera.com/",
  },
  hbar_pay_url:
    "https://buy.moonpay.com/?colorCode=�E5E5&currencyCode=hbar&enableRecurringBuys=true&walletAddress=0.0.793785",
  extension_url:
    "https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk",
  ids: {
    tokenId: "0.0.834116",
    stakingContractId: "0.0.834119",
    rewardsContractId: "0.0.834120",
  },
  comingSoon: false,
  minDeposit: 0.01 * 10 ** 8,
  maxDeposit: 1000 * 10 ** 8,
};
