import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import { config } from "../config/config";
import { useAppContext } from "@libs/appContext";
import { useQuery } from "react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import { LS_BATCHES_HOLDING, UNDELEGATION_BATCH } from "@constants/queriesKey";
import { UndelegationType } from "@types_/common";

const {
  liquidStaking: contractAddress,
  lpcw20: terraswapLpCw20Address,
  lpPool: terraswapPoolAddress,
  loopLpCw20: loopLpCw20Address,
  loopLpPool: loopLpPoolAddress,
  loopStakingContract: loopStakingContract,
} = config.contractAddresses;

type LiquidNativeTokenProps = {
  nativeToken: number;
  liquidNativeToken: number;
  batches: any;
  holdings: any;
};

const useLPBatchHoldingLuquidNativeToken = () => {
  const { walletAddress, terra } = useAppContext();
  const [batches, setBatches] = useState<any>([]);
  const handleNativeTokenInfo = async (walletAddress: string): Promise<LiquidNativeTokenProps> => {
    // TODO: bchain - this works for now. but when we start adding more LunaX <> Luna pools we need to
    // create a separate custom hook to get the dex info.
    let userBalanceTerraswap = 0;
    let totalBalanceTerraswap = 0;
    let totalNativeTokenTerraswap = 0;
    let totalLiquidNativeTokenTerraswap = 0;
    let totalNativeTokenLoop = 0;
    let totalLiquidNativeTokenLoop = 0;
    let nativeTokenLoopToken = 0;
    let liquidNativeTokenLoopToken = 0;
    let holdings: any;
    let batches: any;

    await Promise.all([
      terra.wasm
        .contractQuery(contractAddress, {
          get_user_info: {
            user_addr: walletAddress,
          },
        })
        .then((r: any) => {
          holdings = Number(r.user_info.total_tokens ?? 0);
          // setHoldings(tokens);
        }),
      terra.wasm
        .contractQuery(contractAddress, {
          get_user_undelegation_records: {
            user_addr: walletAddress,
          },
        })
        .then((r: any[]) => {
          if (r?.length) {
            batches = r;
            // setBatches(r);
          }
        }),
      terra.wasm
        .contractQuery(terraswapLpCw20Address, {
          balance: { address: walletAddress },
        })
        .then((r: any) => {
          userBalanceTerraswap = nativeTokenFormatter(parseFloat(r.balance));
        }),
      terra.wasm
        .contractQuery(terraswapLpCw20Address, {
          token_info: {},
        })
        .then((r: any) => {
          totalBalanceTerraswap = nativeTokenFormatter(parseFloat(r.total_supply));
        }),
      terra.wasm
        .contractQuery(terraswapPoolAddress, {
          pool: {},
        })
        .then((r: any) => {
          r.assets.forEach((asset: any) => {
            if (
              asset &&
              asset.info &&
              asset.info.token &&
              asset.info.token.contract_addr
            ) {
              totalLiquidNativeTokenTerraswap = nativeTokenFormatter(parseFloat(asset.amount));
            } else {
              totalNativeTokenTerraswap = nativeTokenFormatter(parseFloat(asset.amount));
            }
          });
        }),
    ]);

    // TODO: bchain - only have loop contracts for mainnet
    if (config.network.name === "mainnet") {
      let userBalanceLoop = 0;
      let userStakedLpBalanceLoop = 0;
      let totalBalanceLoop = 0;
      let totalNativeTokenLoop = 0;
      let totalLiquidNativeTokenLoop = 0;
      await Promise.all([
        terra.wasm
          .contractQuery(loopLpCw20Address, {
            token_info: {},
          })
          .then((r: any) => {
            totalBalanceLoop = nativeTokenFormatter(parseFloat(r.total_supply));
          }),
        terra.wasm
          .contractQuery(loopLpCw20Address, {
            balance: { address: walletAddress },
          })
          .then((r: any) => {
            userBalanceLoop = nativeTokenFormatter(parseFloat(r.balance));
          }),
        terra.wasm
          .contractQuery(loopStakingContract, {
            query_staked_by_user: {
              wallet: walletAddress,
              staked_token: loopLpCw20Address,
            },
          })
          .then((r: any) => {
            userStakedLpBalanceLoop = nativeTokenFormatter(parseFloat(r));
          }),
        terra.wasm
          .contractQuery(loopLpPoolAddress, {
            pool: {},
          })
          .then((r: any) => {
            r.assets.forEach((asset: any) => {
              if (
                asset &&
                asset.info &&
                asset.info.token &&
                asset.info.token.contract_addr
              ) {
                totalLiquidNativeTokenLoop = nativeTokenFormatter(parseFloat(asset.amount));
              } else {
                totalNativeTokenLoop = nativeTokenFormatter(parseFloat(asset.amount));
              }
            });
          }),
      ]);

      nativeTokenLoopToken =
        ((userBalanceLoop + userStakedLpBalanceLoop) * totalNativeTokenLoop) /
        totalBalanceLoop;
      liquidNativeTokenLoopToken =
        ((userBalanceLoop + userStakedLpBalanceLoop) * totalLiquidNativeTokenLoop) /
        totalBalanceLoop;
    }

    const nativeTokenTerraswapToken =
      (userBalanceTerraswap * totalNativeTokenTerraswap) / totalBalanceTerraswap;
    const liquidNativeTokenXTerraswapToken =
      (userBalanceTerraswap * totalLiquidNativeTokenTerraswap) / totalBalanceTerraswap;

    const nativeToken = nativeTokenTerraswapToken + nativeTokenLoopToken;
    const liquidNativeToken = liquidNativeTokenXTerraswapToken + liquidNativeTokenLoopToken;

    return { nativeToken: nativeToken, liquidNativeToken: liquidNativeToken, batches, holdings };
  };

  const { data, isLoading, refetch } = useQuery<LiquidNativeTokenProps>(
    [LS_BATCHES_HOLDING, walletAddress],
    () => handleNativeTokenInfo(walletAddress),
    {
      enabled: false,
      onSuccess: (res) => {
        setBatches(res.batches);
      },
    }
  );

  useEffect(() => {
    if (walletAddress) {
      refetch();
    }
  }, [walletAddress]);

  const handleUndelegation = async (batches: any) => {
    const undelegationRecords: UndelegationType[] = [];
    await Promise.all(
      batches.map(async (batch: any) => {
        await terra.wasm
          .contractQuery(contractAddress, {
            batch_undelegation: {
              batch_id: batch.batch_id,
            },
          })
          .then((r: any) => {
            const record: UndelegationType = r.batch;
            undelegationRecords.push({
              ...record,
              batch_id: batch.batch_id,
              token_amount: batch.token_amount,
            });
          });
      })
    );
    return undelegationRecords.sort((a, b) => {
      return (
        +new Date(
          moment.unix(Number(b.est_release_time) / 1000000000).format("lll")
        ) -
        +new Date(
          moment.unix(Number(a.est_release_time) / 1000000000).format("lll")
        )
      );
    });
  };

  const undelegationQuery = useQuery<any[]>([UNDELEGATION_BATCH, batches], () =>
    handleUndelegation(batches)
  );

  return { data, isLoading, undelegationQuery };
};

export default useLPBatchHoldingLuquidNativeToken;
