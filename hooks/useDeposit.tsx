import { getContractByName } from "@utils/contractFilters";
import { MsgExecuteContract, StdFee } from "@terra-money/terra.js";
import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from "@anchor-protocol/notation";
import { useAppContext } from "@libs/appContext";
import { useWallet } from "@terra-money/wallet-provider";
import {
  messageMemo,
  NATIVE_TOKEN_LABEL,
  ustFeeStaking,
} from "@constants/constants";
import { updateUser } from "@services/users";
import { getAnalytics, logEvent } from "firebase/analytics";
import { useMutation, useQueryClient } from "react-query";
import { MutationResponseType } from "@types_/common";
import { PoolsAndContractsType } from "@types_/stake-pools";
import { CONTRACTS_AND_POOLS } from "@constants/queriesKey";

export type DepositProps = {
  amount: number;
  walletAddress?: string;
  contracts: any;
  poolId: number;
};

export type DepositAmountProps = {
  poolIndex: number;
  contracts: any;
  amount: number;
  gasAmount: number;
};

interface DepositSuccess extends MutationResponseType {
  depositedAmount: number;
  poolIndex: number;
}

const useDeposit = () => {
  const { terra, walletAddress, updateWalletBalance } = useAppContext();
  const wallet = useWallet();
  const queryClient = useQueryClient();

  const getEstimateTransFee = async (args: DepositProps) => {
    const { amount, contracts, poolId } = args;

    const poolsContractAddress: any = getContractByName(contracts, "Pools");
    const contractAddress = poolsContractAddress.addr;

    let msgs: any[] = [];

    const msg = new MsgExecuteContract(
      walletAddress,
      contractAddress,
      {
        deposit: {
          pool_id: poolId,
        },
      },
      { uNativeToken: (amount * 1000000).toFixed() }
    );
    msgs.push(msg);
    const rawEstimatedFees = await terra.tx.estimateFee(walletAddress, msgs);
    const estimatedTxFee: number = parseFloat(
      parseFloat(
        formatUSTWithPostfixUnits(
          demicrofy(rawEstimatedFees.amount._coins.uNativeToken.amount)
        )
      ).toFixed(2)
    );

    return { estimatedTxFee, estimatedGasFee: rawEstimatedFees.gas };
  };

  const logFirebaseEvent = (eventName: string) => {
    const analytics = getAnalytics();
    logEvent(analytics, eventName);
  };

  const handleDepositAmount = async (
    args: DepositAmountProps
  ): Promise<DepositSuccess> => {
    try {
      const { poolIndex, contracts, amount, gasAmount } = args;
      const poolsContractAddress: any = getContractByName(contracts, "Pools");

      const contractAddress = poolsContractAddress.addr;

      const msg = new MsgExecuteContract(
        walletAddress,
        contractAddress,
        {
          deposit: {
            pool_id: poolIndex,
          },
        },
        {
          uNativeToken: (amount * 1000000).toFixed(),
        }
      ) as any;

      const txResult = await wallet.post({
        msgs: [msg],
        fee: new StdFee(
          gasAmount,
          `${(ustFeeStaking * 1000000).toFixed()}uusd`
        ) as any,
        memo: messageMemo,
      });
      if (!(!!txResult.result && !!txResult.result.txhash)) {
        await Promise.reject(Error("Failed to send transaction"));
      }
      let depositedAmount = 0;

      if (txResult.result && txResult.result.txhash) {
        let updateAmount = (amount * 1000000).toFixed();

        depositedAmount = parseInt(updateAmount);
      }

      await new Promise((resolve) =>
        setTimeout(async () => {
          resolve(updateWalletBalance());
        }, 5000)
      );

      return {
        success: true,
        message: `Your deposit of ${parseFloat(amount.toString()).toFixed(
          4
        )} ${NATIVE_TOKEN_LABEL} is successful!`,
        depositedAmount,
        poolIndex,
      };
    } catch (err) {
      throw new Error("Error reported in fetching pools " + err);
    }
  };

  const { data, mutate, isLoading, reset } = useMutation<
    DepositSuccess,
    never,
    DepositAmountProps
  >("", (args: DepositAmountProps) => handleDepositAmount(args), {
    onSuccess: async (res) => {
      await updateUser(walletAddress);

      logFirebaseEvent("deposited");

      const { poolIndex, depositedAmount } = res;

      queryClient.setQueryData<PoolsAndContractsType>(
        [CONTRACTS_AND_POOLS, walletAddress],
        (prev) => {
          return {
            ...prev,
            pools: prev?.pools.map((pool) =>
              pool.pool_id === poolIndex
                ? {
                    ...pool,
                    computed_deposit:
                      parseInt(pool.computed_deposit) + depositedAmount,
                    deposit: parseInt(pool.deposit) + depositedAmount,
                  }
                : pool
            ),
          } as PoolsAndContractsType;
        }
      );
    },
  });

  return {
    handleDepositAmount: mutate,
    isLoading,
    data,
    getEstimateTransFee,
    resetForm: reset,
  };
};

export default useDeposit;
