import {
  GET_NATIVE_TOKEN_PRICE_URL,
  GET_TOKEN_PRICE_IN_NATIVE_TOKEN_URL,
} from "../constants/constants";
import request from "./client";

export const getNativeTokenPrice = async () => {
  const authParams = {
    url: GET_NATIVE_TOKEN_PRICE_URL,
  };

  const response = await request("post", authParams);
  return response.data;
};

export const getTokenPriceInNativeToken = async (token: string) => {
  const authParams = {
    url: GET_TOKEN_PRICE_IN_NATIVE_TOKEN_URL,
    data: {
      token,
    },
  };

  const response = await request("post", authParams);
  return response.data;
};
