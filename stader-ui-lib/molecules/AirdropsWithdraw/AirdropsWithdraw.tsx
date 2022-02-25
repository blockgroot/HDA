import { Airdrop, Box, Loader, Typography } from "../../atoms";
import styles from "./AirdropsWithdraw.module.scss";
import React, { useState } from "react";
import {
  lunaFormatter,
  lunaFormatterOrion,
} from "../../../utils/CurrencyHelper";
import { ButtonOutlined } from "../../atoms/Button/Button";
import { AirdropsArrayType } from "../../../@types/airdrops";
import { Airdrops } from "../../../constants/airdrops";
import Dropdown from "../../atoms/Dropdown/Dropdown";
import { useLSAirdropModal } from "@molecules/WithdrawModals/LSAirdropModal";
import { useMediaQuery } from "@material-ui/core";
import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";

function AirdropCustomized({
  label,
  value,
  iconPath,
}: {
  label: string;
  value: number;
  iconPath: string;
}) {
  return (
    <div className={styles.airdrop}>
      <Airdrop
        label={
          <Typography className={styles.airdrop_label} variant={"body1"}>
            {label}
          </Typography>
        }
        value={
          <Typography variant={"h1"} className={styles.airdrop_value}>
            {value}
          </Typography>
        }
        icon={
          <img src={iconPath} alt={label} className={styles.airdrop_image} />
        }
      />
    </div>
  );
}

interface Props {
  airdrops: AirdropsArrayType[];
  isLoading?: boolean;
  contracts?: any;
  cfsccAirdrops?: any;
  sccAirdrops?: any;
}

export default function AirdropsWithdraw(props: Props) {
  const { airdrops, isLoading, contracts, cfsccAirdrops, sccAirdrops } = props;

  const [showAirdrops, setShowAirdrops] = useState(false);

  const tabletUp = useMediaQuery(`(min-width: ${MQ_FOR_TABLET_LANDSCAPE}px)`);
  const [openAirdropsDialog, airdropsDialogElement] = useLSAirdropModal();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleModalOpen = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleModalClose = () => {
    setAnchorEl(null);
  };

  const canWithdrawAirdrops = () => {
    const airdropTokens = Object.keys(airdrops);
    const areAirdropsPresent = airdropTokens.some((token: any) => {
      return parseInt(airdrops[token].amount) > 1000;
    });

    return areAirdropsPresent;
  };

  const renderElement = (
    <div className={styles.container}>
      <div className={styles.visible_airdrops}>
        {airdrops
          .filter((item, index) => index < (tabletUp ? 3 : 2))
          .map((airdrop: any) => {
            let name = airdrop.denom;
            return (
              <AirdropCustomized
                label={name}
                value={
                  name === "orion"
                    ? lunaFormatterOrion(airdrop.amount)
                    : lunaFormatter(airdrop.amount)
                }
                iconPath={
                  Airdrops.find((airdrop) => airdrop.denom === name)?.logo || ""
                }
                // iconPath={airdropsDetail[name].path}
                key={name}
              />
            );
          })}

        {tabletUp && (
          <>
            <div onClick={handleModalOpen} className={"py-4 cursor-pointer"}>
              <Typography variant={"body2"} color={"primary"}>
                View All
              </Typography>
            </div>
            <Dropdown anchorEl={anchorEl} onClose={handleModalClose}>
              <div className={styles.airdrop_container}>
                {airdrops.map((airdrop: any) => {
                  let name = airdrop.denom;
                  return (
                    <AirdropCustomized
                      label={name}
                      value={
                        name === "orion"
                          ? lunaFormatterOrion(airdrop.amount)
                          : lunaFormatter(airdrop.amount)
                      }
                      iconPath={
                        Airdrops.find((airdrop) => airdrop.denom === name)
                          ?.logo || ""
                      }
                      // iconPath={airdropsDetail[name].path}
                      key={name}
                    />
                  );
                })}
              </div>
            </Dropdown>
          </>
        )}
        <div>
          {showAirdrops && (
            <div className={styles.mobile_airdrops}>
              {airdrops.map((airdrop: any) => {
                let name = airdrop.denom;
                return (
                  <AirdropCustomized
                    label={name}
                    value={
                      name === "orion"
                        ? lunaFormatterOrion(airdrop.amount)
                        : lunaFormatter(airdrop.amount)
                    }
                    iconPath={
                      Airdrops.find((airdrop) => airdrop.denom === name)
                        ?.logo || ""
                    }
                    // iconPath={airdropsDetail[name].path}
                    key={name}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      {!tabletUp && (
        <div className={styles.mobile_toggle_button}>
          <Typography
            variant={"body2"}
            color={"primary"}
            onClick={() => setShowAirdrops((prev) => !prev)}
          >
            {showAirdrops ? "Hide All" : "View All"}
          </Typography>
        </div>
      )}
      <ButtonOutlined
        disabled={!canWithdrawAirdrops()}
        onClick={() => {
          openAirdropsDialog({
            airdrops,
          });
        }}
        size={"small"}
        className={"px-8"}
      >
        Withdraw
      </ButtonOutlined>
      {airdropsDialogElement}
    </div>
  );

  return (
    <Box className={styles.root} noPadding>
      {isLoading ? <Loader className={"mx-auto"} /> : renderElement}
    </Box>
  );
}
