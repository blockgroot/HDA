import React from "react";
import airdrop from "../../../assets/svg/airdrops.svg";
import airdrop_pink from "../../../assets/svg/airdrops_pink.svg";
import decentralization from "../../../assets/svg/decentralization.svg";
import decentralization_pink from "../../../assets/svg/decentralization_pink.svg";
import slashing from "../../../assets/svg/slashing.svg";
import slashing_pink from "../../../assets/svg/slashing_pink.svg";
import airdrops_plus_pool from "../../assets/svg/airdrops_plus_pool.svg";
import arrow_down from "../../assets/svg/arrow_down.svg";
import arrow_up from "../../assets/svg/arrow_up.svg";
import blueChip_pool from "../../assets/svg/blue_chip_pool.svg";
import community_pool from "../../assets/svg/community_pool.svg";
import copy_address from "../../assets/svg/copy_address.svg";
import info_outline from "../../assets/svg/info_outline.svg";
import wallet_icon from "../../assets/svg/wallet_icon.svg";
import check_success from "../../assets/svg/check_success.svg";
import check_success_aqua from "../../assets/svg/check_success_aqua.svg";
import token_icon from "../../assets/svg/token_icon.svg";

export const icons = {
  clipboard: copy_address,
  wallet: wallet_icon,
  airdrop: { default: airdrop, primary: airdrop_pink },
  decentralization: {
    default: decentralization,
    primary: decentralization_pink,
  },
  info_outline: info_outline,
  slashing: { default: slashing, primary: slashing_pink },
  airdrops_plus_pool: airdrops_plus_pool,
  community_pool: community_pool,
  blue_chip_pool: blueChip_pool,
  arrow_up: arrow_up,
  arrow_down: arrow_down,
  check_success: check_success,
  check_success_aqua: check_success_aqua,
  token_icon:token_icon
};

export interface IconType extends React.ComponentPropsWithoutRef<"img"> {
  name: keyof typeof icons;
  color?: string;
  width: number;
  height: number;
}
