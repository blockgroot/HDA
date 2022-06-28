import { HederaNetwork } from "@bladelabs/blade-web3.js/lib/src/models/blade";

export const testnetConfig = {
  network: {
    name: "testnet",
    url: "https://testnet.mirrornode.hedera.com/",
    bladeWallet: HederaNetwork.Testnet,
  },
  hbar_buy_url: "https://purchase.banxa.com/",
  extension_url:
    "https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk",
  blade_extension_url:
    "https://chrome.google.com/webstore/detail/blade-new-hedera-wallet/abogmiocnneedmmepnohnhlijcjpcifd",
  ids: {
    //   - Token ID: 0.0.34752691
    // - Staking contract ID: 0.0.34752698
    // - Rewards contract ID: 0.0.34752699
    // - Undelegation contract ID: 0.0.34752697

    // [ '0.0.45957413', '0.0.45957963', '0.0.45957429', '0.0.45957961' ]

    tokenId: "0.0.45957413",
    oldContractIds: [],
    stakingContractId: "0.0.45957963",
    rewardsContractId: "0.0.45957429",
    undelegationContractId: "0.0.45957961",
  },
  comingSoon: false,
  minDeposit: 0.01 * 10 ** 8,
  maxDeposit: 999999999.9999 * 10 ** 8,
  firebaseConfig: {
    apiKey: "AIzaSyCpAi4CmKEmaonFu6uePMH9eThL5EF4c8w",
    authDomain: "stader-hedera-analytics-v0.firebaseapp.com",
    projectId: "stader-hedera-analytics-v0",
    storageBucket: "stader-hedera-analytics-v0.appspot.com",
    messagingSenderId: "874435674431",
    appId: "1:874435674431:web:84598ddd6a649ee124138a",
    measurementId: "G-E5202G3DHL",
  },
};
