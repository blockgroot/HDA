import { HederaNetwork } from "@bladelabs/blade-web3.js/lib/src/models/blade";

export const betaMainnetConfig = {
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
    // [ '0.0.1001864', '0.0.1001961', '0.0.1001873', '0.0.1001960' ]
    //[ '0.0.1025713', '0.0.1025728', '0.0.1025720', '0.0.1025726' ]
    tokenId: "0.0.1025713",
    // oldContractIds: ["0.0.937108"],
    // stakingContractId: "0.0.955403",
    stakingContractId: "0.0.1025728",
    rewardsContractId: "0.0.1025720",
    undelegationContractId: "0.0.1025726",
  },
  comingSoon: true,
  minDeposit: 0.01 * 10 ** 8,
  maxDeposit: 50 * 10 ** 8,
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
