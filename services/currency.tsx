import {
  GET_LUNA_PRICE_URL,
  GET_TOKEN_PRICE_IN_LUNA_URL,
} from "../constants/constants";
import request from "./client";

export const getLunaPrice = async () => {
  const authParams = {
    url: GET_LUNA_PRICE_URL,
  };

  const response = await request("post", authParams);
  return response.data;
};

export const getTokenPriceInLuna = async (token: string) => {
  const authParams = {
    url: GET_TOKEN_PRICE_IN_LUNA_URL,
    data: {
      token,
    },
  };

  const response = await request("post", authParams);
  return response.data;
};
