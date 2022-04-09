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
    tokenId: "0.0.803264",
    stakingContractId: "0.0.803295",
    rewardsContractId: "0.0.803296",
  },
  comingSoon: true,
  minDeposit: 0.01 * 10 ** 8,
  maxDeposit: 500 * 10 ** 8,
};
