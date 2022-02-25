import axios from "axios";
import { config } from "../config/config";
import { authenticateUser } from "./users";

let isAlreadyFetchingAccessToken = false;
let subscribers: any = [];

const client = axios.create({
  baseURL: config.LIQUID_STAKING_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

const requestLiquidStaking = async (method: string, options: any) => {
  return client.request({
    method,
    headers: {},
    ...options,
  });
};

export default requestLiquidStaking;

// Intercept all request
client.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log("******ERROR", error);

    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  async (response) => {
    return response;
  },
  (error) => {
    const errorResponse = error.response;

    console.log("******ERROR RESPONSE", errorResponse);
    return Promise.reject(error);
  }
);
