import { useConnectedWallet } from "@terra-money/wallet-provider";
import { config } from "../../../../config/config";
import StaderContract from "./StaderContract";
import { SaleOptionType } from "./useSignupFormState";

type ExecuteMsg = {
  register_user_details: {
    encrypted_string: string;
    option: SaleOptionType;
  };
};
type QueryMsg = { get_user: { user: string } };

const useSignupContract = () => {
  const connectedWallet = useConnectedWallet();

  if (!connectedWallet) {
    throw new Error("Wallet is not connected");
  }

  const contract = new StaderContract<QueryMsg, ExecuteMsg>(
    config.contractAddresses.coinListSaleSignup,
    connectedWallet
  );

  const checkIfAlreadySignedUp = async () => {
    return contract
      .query<{ user?: ExecuteMsg["register_user_details"] }>({
        get_user: { user: connectedWallet.terraAddress },
      })
      .then((r) => !!r.user);
  };

  const signup = async (encryptedEmail: string, option: SaleOptionType) => {
    return contract.execute({
      register_user_details: {
        encrypted_string: encryptedEmail,
        option,
      },
    });
  };

  return {
    checkIfAlreadySignedUp,
    signup,
  };
};

export default useSignupContract;
