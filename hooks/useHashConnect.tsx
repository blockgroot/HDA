import { useContext } from "react";
import { HashConnectAPIContext } from "../context/HashConnectProvider";

const useHashConnect = () => {
  const value = useContext(HashConnectAPIContext);
  return value;
};

export default useHashConnect;
