import axios from "axios";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { config } from "../config/config";
import { authenticateUser } from "./users";

let isAlreadyFetchingAccessToken = false;
let subscribers: any = [];

const client = axios.create({
  baseURL: "https://localhost:3000",
  headers: {
    Accept: "application/json",
  },
});

const request = async (method: string, options: any) => {
  const auth = await getAuth();
  const authUser: any = auth.currentUser;
  let user: any = localStorage.getItem("user");
  user = JSON.parse(user);

  let token = "";
  if (!authUser) {
    token = user?.accessToken;
  } else if (user && user.accessToken) {
    token = await getIdToken(authUser, true);
    user.accessToken = token;
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    const authenticatedUser = authenticateUser();
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
  }

  return client.request({
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });
};

export default request;

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
    if (isTokenExpiredError(errorResponse)) {
      return resetTokenAndReattemptRequest(error);
    }
    return Promise.reject(error);
  }
);

const isTokenExpiredError = (errorResponse: any) => {
  if (errorResponse && errorResponse.status) {
    const errorMessage = errorResponse.data.msg;
    return (
      (errorResponse.status === 403 || errorResponse.status === 401) &&
      errorMessage &&
      errorMessage === "Unauthorized access"
    );
  }
};

function onAccessTokenFetched(accessToken: any) {
  // When the refresh is successful, we start retrying the requests one by one and empty the queue
  subscribers.forEach((callback: any) => callback(accessToken));
  subscribers = [];
}

function addSubscriber(callback: any) {
  subscribers.push(callback);
}

const resetTokenAndReattemptRequest = async (error: any) => {
  try {
    const { response: errorResponse } = error;

    const retryOriginalRequest = new Promise((resolve) => {
      /* We need to add the request retry to the queue
	since there another request that already attempt to
	refresh the token */
      addSubscriber((accessToken: any) => {
        errorResponse.config.headers.Authorization = `Bearer ${accessToken}`;
        resolve(axios(errorResponse.config));
      });
    });
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      const user: any = authenticateUser();

      const newAccessToken = user.accessToken;

      isAlreadyFetchingAccessToken = false;
      onAccessTokenFetched(newAccessToken);
    }
    return retryOriginalRequest;
  } catch (err) {
    return Promise.reject(err);
  }
};
