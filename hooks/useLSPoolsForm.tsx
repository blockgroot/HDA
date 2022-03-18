import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import { config } from "../config/config";
import {
  LIQUID_NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_LABEL,
  NATIVE_TOKEN_MULTIPLIER,
  ustFee,
  ustFeeStaking,
} from "@constants/constants";
import { useAppContext } from "@libs/appContext";
import { useWallet } from "@terra-money/wallet-provider";
import { useMutation, useQueryClient } from "react-query";
import Error from "next/error";
import {
  LS_BATCHES_HOLDING,
  LS_TVL,
  UNDELEGATION_BATCH,
  USER_HOLDING,
} from "@constants/queriesKey";

const { liquidStaking: contractAddress, cw20: tokenAddress } =
  config.contractAddresses;

type QueryDataType = { success: boolean; message: string };

function useLSPoolsForm() {
  const queryClient = useQueryClient();
  const { walletAddress, terra, updateWalletBalance } = useAppContext();
  const wallet = useWallet();

  const handleStake = async (amount: number): Promise<QueryDataType> => {
    try {
      const msg = new MsgExecuteContract(
        walletAddress,
        contractAddress,
        {
          deposit: {},
        },
        { uNativeToken: (amount * NATIVE_TOKEN_MULTIPLIER).toFixed() }
      );

      const txResult: any = await postTransaction(
        walletAddress,
        msg,
        "staking"
      );

      if (!(!!txResult.result && !!txResult.result.txhash)) {
        return Promise.reject("Failed to send transaction");
      }

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(updateWalletBalance());
        }, 9000);
      });

      await queryClient.refetchQueries([LS_TVL, contractAddress]);

      await new Promise((resolve) => {
        setTimeout(async () => {
          resolve(
            await queryClient.refetchQueries([USER_HOLDING, walletAddress])
          );
        }, 3000);
      });

      return {
        success: true,
        message: `Staking of ${amount} ${NATIVE_TOKEN_LABEL} is successful!`,
      };
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };

  const stakingMutation = useMutation<QueryDataType, never, number>(
    "",
    (amount: number) => handleStake(amount)
  );

  const handleUnstake = async (amount: number) => {
    try {
      const msg = new MsgExecuteContract(walletAddress, tokenAddress, {
        send: {
          contract: contractAddress,
          amount: (amount * NATIVE_TOKEN_MULTIPLIER).toFixed(),
          msg: Buffer.from(
            JSON.stringify({
              queue_undelegate: {},
            })
          ).toString("base64"),
        },
      });

      // const hash = hashTxBytes(msg);

      const txResult: any = await postTransaction(
        walletAddress,
        msg,
        "unstaking"
      );

      if (!(!!txResult.result && !!txResult.result.txhash)) {
        await Promise.reject("Failed to send transaction");
      }

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (updateWalletBalance) {
            resolve(updateWalletBalance());
          }
        }, 4000);
      });

      const holding: any = queryClient.getQueryData([
        LS_BATCHES_HOLDING,
        walletAddress,
      ]);

      await new Promise((resolve) => {
        setTimeout(async () => {
          resolve(
            await queryClient.refetchQueries([USER_HOLDING, walletAddress])
          );
        }, 2000);
      });

      await new Promise((resolve) => {
        setTimeout(async () => {
          resolve(await queryClient.refetchQueries([LS_TVL, contractAddress]));
        }, 1000);
      });

      await new Promise((resolve) => {
        setTimeout(async () => {
          resolve(
            await queryClient.refetchQueries([
              LS_BATCHES_HOLDING,
              walletAddress,
            ])
          );
        }, 2000);
      });

      return {
        success: true,
        message: `Unstaking of ${amount} ${LIQUID_NATIVE_TOKEN_LABEL} is successful!`,
      };
    } catch (err: any) {
      throw new Error(err);
    }
  };

  const unStakingMutation = useMutation<QueryDataType, never, number>(
    "",
    (amount: number) => handleUnstake(amount)
  );

  const postTransaction = async (
    walletAddress: string,
    msg: MsgExecuteContract,
    tab: "staking" | "unstaking"
  ) => {
    if (terra && wallet) {
      const fee = await terra.tx.estimateFee(walletAddress, [msg]);
      const transaction: any = {
        msgs: [msg],
        memo: "STADER",
      };

      const feeInUst = tab === "staking" ? ustFeeStaking : ustFee;
      if (fee?.gas) {
        // @ts-ignore
        transaction.fee = new StdFee(
          fee.gas,
          `${(feeInUst * 1000000).toFixed()}uusd`
        );
      }

      return await wallet.post(transaction);
    } else {
      return {};
    }
  };
  const outputAmountLiquidNativeToken = (
    value: string | number,
    exchangeRate: number
  ) => {
    if (!value || !exchangeRate) {
      return "";
    }

    return (Number(value) / exchangeRate).toFixed(6);
  };

  const outputAmountLiquidNativeTokenToNativeToken = (
    value: string | number,
    exchangeRate: number
  ) => {
    if (!value || !exchangeRate) {
      return "";
    }

    return (Number(value) * exchangeRate).toFixed(6);
  };

  return {
    handleStake: stakingMutation.mutate,
    isLoading: stakingMutation.isLoading,
    resetQuery: stakingMutation.reset,
    data: stakingMutation.data,
    outputAmountLiquidNativeToken: outputAmountLiquidNativeToken,
    handleUnstake: unStakingMutation.mutate,
    unStakingMutation,
    outputAmountLiquidNativeTokenToNativeToken:
      outputAmountLiquidNativeTokenToNativeToken,
  };
}

export default useLSPoolsForm;
