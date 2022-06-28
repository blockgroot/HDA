import { apiPath, unBondingTime } from "@constants/constants";
import { BigNumber } from "@hashgraph/hethers";
import axios from "axios";
import { config } from "config/config";
import { useEffect, useState } from "react";
import useHashConnect from "./useHashConnect";

interface ResponseTransaction {
  amount: number;
  bloom: string;
  call_result: string;
  contract_id: string;
  created_contract_ids: [];
  error_message: string;
  from: string;
  function_parameters: string;
  gas_limit: number;
  gas_used: number;
  timestamp: string;
  to: string;
}

export interface UndelegateData {
  index: number;
  amount: number;
  isWithDrawn: boolean;
  time: number;
  exchangeRate: number;
}

export interface BuildPagedDataInput {
  config: Object;
  apiPath: string;
  stakingContractId: string;
  userId: string;
}

const buildPagedResponse = async (data: {
  url: string;
  apiPath: string;
  stakingContractId: string;
  userId: string;
}) => {
  const response = [];
  const unstakeResponse: any = await axios.get(
    `${data.url}${data.apiPath}contracts/${data.stakingContractId}/results?from=${data.userId}&limit=100&order=asc`
  );
  if (unstakeResponse?.data?.results?.length > 0) {
    response.push(...unstakeResponse?.data?.results);
  }

  let hasNext = unstakeResponse?.data?.links?.next;
  while (hasNext) {
    const unstakeResponse: any = await axios.get(
      `${data.url.slice(0, -1)}${hasNext}`
    );
    if (unstakeResponse?.data?.results?.length > 0) {
      response.push(...unstakeResponse?.data?.results);
    }
    hasNext = unstakeResponse?.data?.links?.next;
  }
  return response;
};

export default function useWithdrawals() {
  const { selectedAccount } = useHashConnect();
  const [data, setData] = useState<UndelegateData[]>([]);

  const [error, setError] = useState<boolean>(false);

  //TODO: Pagination
  const getUnStakeData = async () => {
    const stakingContractId = config.ids.stakingContractId;
    const undelegationContractId = config.ids.undelegationContractId;
    const userId = selectedAccount.toString();

    try {
      const unstakeResponse = await buildPagedResponse({
        url: config.network.url,
        apiPath,
        stakingContractId,
        userId,
      });

      if (unstakeResponse) {
        const undelegateData: UndelegateData[] = await (unstakeResponse ?? [])
          .filter((trans: ResponseTransaction) => {
            return (
              trans.function_parameters.substring(0, 10) === "0x5d3eea91" &&
              trans.error_message === null &&
              trans.call_result != "0x"
            );
          })
          .map((trans: ResponseTransaction, index: number) => {
            const hbar = BigNumber.from(trans.call_result).toNumber();
            const hbarx = BigNumber.from(
              `0x${trans.function_parameters.substring(10)}`
            ).toNumber();
            const exchangeRate = hbar / hbarx;
            return {
              index,
              time: new Date(
                (parseFloat(trans.timestamp) + unBondingTime) * 1000
              ).getTime(),
              amount: hbar,
              exchangeRate,
              isWithDrawn: false,
            };
          });

        const withdrawResponse: any = await axios.get(
          `${config.network.url}${apiPath}contracts/${undelegationContractId}/results?from=${userId}&limit=100&order=asc`
        );

        withdrawResponse.data.results
          .filter((trans: ResponseTransaction) => {
            return (
              trans.function_parameters.substring(0, 10) === "0x2e1a7d4d" &&
              trans.error_message === null
            );
          })
          .map((trans: ResponseTransaction) => {
            const index = parseInt(trans.function_parameters.substring(10), 16);
            undelegateData[index].isWithDrawn = true;
            undelegateData[index].time = new Date(
              parseFloat(trans.timestamp) * 1000
            ).getTime();
          });
        setData(undelegateData);
      } else {
        console.error("error");
      }
    } catch (err) {
      // Handle Error Here
      console.error("error", err);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      getUnStakeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount]);

  return { data, getUnStakeData };
}
