import { useQuery } from "react-query";
import { config } from "../config/config";
import { useAppContext } from "@libs/appContext";
import { USER_HOLDING } from "@constants/queriesKey";

const { liquidStaking: contractAddress } = config.contractAddresses;

const useUserHolding = () => {
  const { terra, walletAddress } = useAppContext();
  const fetchHolding = async (walletAddress: string) => {
    try {
      let token: any = await terra.wasm.contractQuery(contractAddress, {
        get_user_info: {
          user_addr: walletAddress,
        },
      });
      return Number(token.user_info.total_tokens ?? 0);
    } catch (e) {}
  };

  const { data, isLoading, error, ...others } = useQuery(
    [USER_HOLDING, walletAddress],
    () => fetchHolding(walletAddress)
  );

  return { holding: data ? data : 0, isLoading, error, ...others };
};

export default useUserHolding;
