import { betaMainnetConfig } from "./betaMainnetConfig";
import { mainnetConfig } from "./mainnet";
import { testnetConfig } from "./testnetConfig";

export const config =
  process.env.NEXT_PUBLIC_GIT_REF === "main"
    ? mainnetConfig
    : process.env.NEXT_PUBLIC_GIT_REF === "beta"
    ? betaMainnetConfig
    : testnetConfig;
