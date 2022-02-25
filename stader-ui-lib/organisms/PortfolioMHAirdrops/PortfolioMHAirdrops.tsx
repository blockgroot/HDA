import { Box, Typography } from "../../atoms";
import React from "react";
import { AirdropsType } from "@types_/portfolio";
import { ButtonOutlined } from "@atoms/Button/Button";
import SPPortfolioAirdrop from "@molecules/SPPortfolioAirdrop/SPPortfolioAirdrop";
import { useAirdropsDialog } from "@molecules/WithdrawModals/AirdropModal";
import { getContractByName } from "@utils/contractFilters";
import styles from "./PortfolioMHAirdrops.module.scss";

interface Props {
  airdrops: AirdropsType;
  isLoading?: boolean;
  contracts: any;
  cfsccAirdrops: any;
  sccAirdrops: any;
}

export default function PortfolioMHAirdrops(props: Props) {
  const { airdrops, contracts, cfsccAirdrops, sccAirdrops } = props;

  const [openAirdropsDialog, airdropsDialogElement] = useAirdropsDialog();

  const canWithdrawAirdrops = () => {
    const airdropTokens = Object.keys(airdrops) as Array<keyof typeof airdrops>;
    const areAirdropsPresent = airdropTokens.some(
      (token: keyof typeof airdrops) => {
        let airdrop = airdrops[token];
        return parseInt(String(airdrop.amount)) > 1000;
      }
    );

    return areAirdropsPresent;
  };
  const handleRefetch = async () => {
    // await queryClient.refetchQueries([SP_PORTFOLIO_HOLDING, walletAddress]);
  };
  return (
    <div>
      <Typography variant={"h2"} fontWeight={"bold"} className={"mb-2 md:mb-8"}>
        Airdrops
      </Typography>
      <Box className={styles.airdrops_box} noPadding>
        <SPPortfolioAirdrop airdrops={airdrops} show={3} />
        <ButtonOutlined
          size={"small"}
          className={styles.withdraw_button}
          disabled={!canWithdrawAirdrops()}
          onClick={() => {
            openAirdropsDialog({
              sccContractAddress: getContractByName(contracts, "scc"),
              cfsccContractAddress: getContractByName(contracts, "cfscc"),
              cfsccAirdrops,
              sccAirdrops,
              refreshPage: handleRefetch,
            });
          }}
        >
          Withdraw
        </ButtonOutlined>
      </Box>
      {airdropsDialogElement}
    </div>
  );
}
