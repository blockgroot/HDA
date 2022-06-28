import { config } from "config/config";
import { SaveData } from "context/HashConnectProvider";

const SAVE_KEY = `hashConnectData/${config.network.name}`;

export class StorageService {
  static loadLocalData(): null | SaveData {
    let foundData = localStorage.getItem(SAVE_KEY);

    if (foundData) {
      const saveData: SaveData = JSON.parse(foundData);
      // setSaveData(saveData);
      return saveData;
    } else return null;
  }

  static saveData(saveObj: SaveData) {
    let dataToSave = JSON.stringify(saveObj);
    localStorage.setItem(SAVE_KEY, dataToSave);
  }

  static remove() {
    localStorage.removeItem(SAVE_KEY);
  }

  static saveTerms(isAccepted: boolean) {
    localStorage.setItem("terms_accepted", `${isAccepted}`);
  }

  static getTerms(): boolean {
    return localStorage.getItem("terms_accepted") === "true";
  }

  static isBanxaTermsAccepted(): boolean {
    return (
      window !== undefined && localStorage.getItem("banxa_terms_accepted") === "true"
    );
  }

  static setBanxaTermsAccepted(isAccepted: boolean) {
    localStorage.setItem("banxa_terms_accepted", `${isAccepted}`);
  }
}
