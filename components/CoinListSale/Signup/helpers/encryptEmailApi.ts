import axios from "axios";
import COINLIST_SALE_CONSTANTS from "../../constants";

const encryptEmailApi = async (email: string) => {
  return axios
    .post(COINLIST_SALE_CONSTANTS.encryptEmailApiUrl, { email })
    .then((res) => {
      return (res.data as { encryptedText: string }).encryptedText;
    });
};

export default encryptEmailApi;
