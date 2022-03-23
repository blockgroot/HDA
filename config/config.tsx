import { previewNetConfig } from "./previewnetConfig";
import { testnetConfig } from "./testnetConfig";
import { mainnetConfig } from "./mainnet";

export const config =
  process.env.NEXT_PUBLIC_GIT_REF === "main"
    ? mainnetConfig
    : process.env.NEXT_PUBLIC_GIT_REF === "preview"
    ? previewNetConfig
    : testnetConfig;
