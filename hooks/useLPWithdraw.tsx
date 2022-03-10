import { useState } from "react";
import { config } from "../config/config";
import { Undelegation } from "../components/common/WithdrawalsTable";
import moment from "moment";
import { useLiquidStakingWithdrawFundsDialog } from "../dialogs/useLiquidStakingWithdrawFundsDialog";
import { useAppContext } from "../libs/appContext";
import { useWallet } from "@terra-money/wallet-provider";
import { useQuery } from "react-query";
import useLPBatchHoldingLuquidNativeToken from "./useLPBatchHoldingLuquidNativeToken";

type WalletFunds = {
  uusd: number;
  uNativeToken: number;
};

type Props = {
  walletFunds: WalletFunds;
};

const { liquidStaking: contractAddress } = config.contractAddresses;

const useLPWithdraw = ({ walletFunds }: Props) => {
  const { walletAddress, terra } = useAppContext();
  const wallet = useWallet();
  const { data } = useLPBatchHoldingLuquidNativeToken();
  const [openLiquidStakingWithdrawFundsDialog] =
    useLiquidStakingWithdrawFundsDialog();

  const [undelegations, setUndelegations] = useState<Undelegation[]>([]);
  const [withdrawProtocolFee, setWithdrawProtocol] = useState<number>(0);

  const isWalletConnected = !!walletAddress && walletAddress !== "";

  const handleUndelegations = async () => {
    let batches = data?.batches;
    const undelegationRecords: Undelegation[] = [];
    await Promise.all(
      batches.map(async (batch: any) => {
        await terra.wasm
          .contractQuery(contractAddress, {
            batch_undelegation: {
              batch_id: batch.batch_id,
            },
          })
          .then((r: any) => {
            const record: Undelegation = r.batch;
            undelegationRecords.push({
              ...record,
              batch_id: batch.batch_id,
              token_amount: batch.token_amount,
            });
          });
      })
    );
    setUndelegations(
      undelegationRecords.sort((a, b) => {
        return (
          +new Date(
            moment.unix(Number(b.est_release_time) / 1000000000).format("lll")
          ) -
          +new Date(
            moment.unix(Number(a.est_release_time) / 1000000000).format("lll")
          )
        );
      })
    );
  };

  const handleWithdraw = async (undelegation: any) => {
    if (isWalletConnected) {
      await openLiquidStakingWithdrawFundsDialog({
        primaryWalletAddress: walletAddress || "",
        contractAddress,
        wallet,
        amount:
          Number(undelegation.token_amount) *
          Number(undelegation.undelegation_er) *
          Number(undelegation.unbonding_slashing_ratio),
        protocolFee: withdrawProtocolFee,
        undelegationBatchId: undelegation.batch_id as number,
        // refreshPage: handleSuccess,
        terra,
        walletFunds,
      });
    }
  };

  const unDelegationQuery = useQuery(["undelegation", walletAddress], () =>
    handleUndelegations()
  );

  return { undelegations, unDelegationQuery, handleWithdraw };
};

export default useLPWithdraw;
