export const devnetConfig = {
  network: {
    name: "devnet",
    chainID: "localterra",
    lcd: "https://fcd.staderlabs.com:1317",
    walletconnectID: 0,
    fcd: "https://fcd.staderlabs.com:3060",
    localterra: false,
  },
  contractAddresses: {
    staderHub: "terra1e0mwen608mvhn2sw9qs4mtz9gzhuf6axdg75ea",
    anc: "terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc",
    mir: "terra10llyp6v3j3her8u3ce66ragytu45kcmd9asj3u",
    mine: "terra1lqm5tutr5xcw9d5vc4457exa3ghd4sr9mzwdex",
    vkr: "terra1a8hskrwnccq0v7gq3n24nraaqt7yevzy005uf5",
    orion: "terra1mddcdx0ujx89f38gu7zspk2r2ffdl5enyz2u03", //TODO: replace with devnet address
    twd: "terra1xqks9ur5mwejhpxamfns3mh25zuzz8l2hdxug3",
    liquidStaking: "terra1ur0n9mhpvtn6reeqaw7wwun9kl7qa8fgu0p0cp", // TODO: replace with devnet address
    cw20: "terra1yehpgr3n7hncpwvq5d4cz7zkx3qrh7zcr7aa26", // TODO: replace with devnet address
    lpcw20: "terra1qwtxq6j593ujzlqrksmyp3umlrhf2scl89ut3a", // TODO: replace with devnet address
    lpPool: "terra13cgzavhug2we6qun4ugxt6sw38k3myv9w7sghe", // TODO: replace with devnet address
    airdropsContract: "terra1edeqkpz5m98egkdajtwql407nv3h275rkxtcad", // TODO: replace with devnet address
    coinListSaleSignup: "terra1wyljnw9zstjtdt6spddshefdew8rg2lvey8tvp",
    loopStakingContract: "terra1swgnlreprmfjxf2trul495uh4yphpkqucls8fv",
    loopLpCw20: "terra1fsp4mrxtae6ay8lps5qpq3aq9hrv48h30cnyje",
    loopLpPool: "terra1ga8dcmurj8a3hd4vvdtqykjq9etnw5sjglw4rg",
  },
  firebaseConfig: {
    apiKey: "AIzaSyBQF31eQSsVjR0NSPR4l0Lmbu1JzdpAkag",
    authDomain: "stader-ops-dev-one.firebaseapp.com",
    projectId: "stader-ops-dev-one",
    storageBucket: "stader-ops-dev-one.appspot.com",
    messagingSenderId: "672706869906",
    appId: "1:672706869906:web:ff94f40cb9aa356f92c44b",
  },
  stakePlus: {
    pfc: "terra1n85jtvzwjc7lmj8wrjzgwrdygf8utwn9g7w0z7",
  },
  validatorAprs: {
    terravaloper1vk20anceu6h9s00d27pjlvslz3avetkvnwmr35: "10",
    terravaloper1krj7amhhagjnyg2tkkuh6l0550y733jnjnnlzy: "12",
    terravaloper17qy25m5v2j42ye880n3xk2exz5tedsfe4p8w3c: "9.5",
  },
  gtmId: "GTM-N3PWKGP",
  BASE_API_URL: "https://us-central1-stader-ops-dev-one.cloudfunctions.net/",
  LIQUID_STAKING_BASE_URL:
    "https://us-central1-stader-lt-bots-testnet-one.cloudfunctions.net", // TODO: replace with devnet address
  VALIDATORS_URL: "https://fcd.staderlabs.com:3060/v1/staking",
  KYV_URL: "https://staderverse.staderlabs.com/kyvApiGetMetricsByValidator",
  terraStationExtensionURL:
    "https://chrome.google.com/webstore/detail/terra-station/aiifbnbfobpmeekipheeijimdpnlpgpp",
};
