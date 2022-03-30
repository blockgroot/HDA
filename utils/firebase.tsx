import { initializeApp, getApp } from "firebase/app";
import { config } from "../config/config";

let firebase: any;

try {
  firebase = getApp();
} catch {
  firebase = initializeApp({});
}

export { firebase };
