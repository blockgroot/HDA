import { HederaNetwork } from "@bladelabs/blade-web3.js/lib/src/models/blade";

export const mainnetConfig = {
  network: {
    name: "mainnet",
    url: "https://mainnet-public.mirrornode.hedera.com/",
    bladeWallet: HederaNetwork.Mainnet,
  },
  hbar_buy_url: "https://purchase.banxa.com/",
  extension_url:
    "https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk",
  blade_extension_url:
    "https://chrome.google.com/webstore/detail/blade-new-hedera-wallet/abogmiocnneedmmepnohnhlijcjpcifd",
  ids: {
    tokenId: "0.0.834116",
    oldContractIds: [],
    stakingContractId: "0.0.834119",
    rewardsContractId: "0.0.834120",
    undelegationContractId: "0.0.34386429",
  },
  comingSoon: true,
  minDeposit: 0.01 * 10 ** 8,
  maxDeposit: 999999999.9999 * 10 ** 8,
  firebaseConfig: {
    apiKey: "AIzaSyCpAi4CmKEmaonFu6uePMH9eThL5EF4c8w",
    authDomain: "stader-hedera-analytics-v0.firebaseapp.com",
    projectId: "stader-hedera-analytics-v0",
    storageBucket: "stader-hedera-analytics-v0.appspot.com",
    messagingSenderId: "874435674431",
    appId: "1:874435674431:web:93c5708fd5e132b524138a",
    measurementId: "G-93GW5D8632",
  },
};
