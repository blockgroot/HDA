import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  onIdTokenChanged,
} from "firebase/auth";

import request from "./client";

export const authenticateUser = () => {
  const auth = getAuth();
  signInAnonymously(auth)
    .then((res: any) => {
      let authenticatedUser: any = {
        userId: res.user.uid,
        accessToken: res.user.accessToken,
        refreshToken: res.user.stsTokenManager.refreshToken,
      };

      let user = JSON.parse(JSON.stringify(localStorage.getItem("user")));

      if (user.accessToken !== authenticatedUser.accessToken) {
        localStorage.setItem("user", JSON.stringify(authenticatedUser));
      }

      console.log("Authentication Successfull");
      return authenticatedUser;
    })
    .catch((error) => {
      console.log("Error in authentication");
    });
};

export const updateUser = async (userAddress: string) => {
  let authParams = {
    url: "",
    data: {
      userAddress,
    },
  };

  const response = await request("post", authParams);
  return response;
};
