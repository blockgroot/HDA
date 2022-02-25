import { ClickAwayListener, Grid, Modal } from "@material-ui/core";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { useDialog } from "@terra-dev/use-dialog";
import { lunaFormatter, lunaFormatterOrion } from "@utils/CurrencyHelper";
import React, { useEffect, useState } from "react";
import { useStakePlusAirdropsWithdrawDialog } from "./stakeAirdropWithdrawDialog";
import { config } from "../config/config";

export function useStakeAirdropsDialog() {
  return useDialog(StakeAirdropsDialog);
}

interface Props {
  closeDialog?: any;
  refreshPage: any;
  wallet?: any;
  walletAddress?: any;
  terra?: any;
  walletBalance?: any;
  allDelegateValidator?: any;
}

function StakeAirdropsDialog({
  closeDialog,
  refreshPage,
  wallet,
  walletAddress,
  terra,
  walletBalance,
  allDelegateValidator,
}: Props) {
  const [viewLegends, setViewLegends] = useState(false);
  const [viewAirdropsDropdown, setViewAirdropsDropdown] = useState(false);
  const [viewAirdropWithdraw, setViewAirdropWithdraw] = useState(false);
  // data of the drop down
  const [viewAirdropData, setViewAirdropData] = useState<any>({});
  const [validatorAirdrops, setValidatorAirdrops] = useState<any[]>([]);

  const closeAndRefresh = () => {
    closeDialog();
    refreshPage();
  };

  const [
    openStakePlusAirdropsWithdrawDialog,
    stakePlusAirdropsWithdrawElement,
  ] = useStakePlusAirdropsWithdrawDialog();

  const onClickAwayViewAirdrops = () => {
    // setViewAirdropData({})
    setViewAirdropsDropdown(false);
  };

  const toggleOpenViewAirdrops = (item: any) => {
    setViewAirdropData(item);
    setViewAirdropsDropdown(!viewAirdropsDropdown);
  };

  const withdrawAirdrop = () => {
    setViewAirdropWithdraw(true);
  };

  const goBack = () => {
    setViewAirdropWithdraw(false);
  };

  const isAirdropAmountNonZero = (validatorAirdropInfo: any): boolean => {
    const airdropAmounts = Object.values(validatorAirdropInfo.airdrops).filter(
      (item) => item != 0
    ).length;
    return !!airdropAmounts;
  };

  useEffect(() => {
    let validatorAirdropInfo: any[] = [];

    allDelegateValidator.map((item: any, index: number) => {
      let airdropsMap = {
        airdrops: {
          mir: 0,
          anc: 0,
          twd: 0,
          orion: 0,
          mine: 0,
          vkr: 0,
        },
        validatorInfo: {},
      };
      item?.user_info?.total_airdrops.map((subitem: any, index: number) => {
        // TODO: bchain - replace this with each individual airdrop for now to make it type safe
        if (subitem["denom"] === "orion") {
          // @ts-ignore
          airdropsMap.airdrops[subitem["denom"]] = lunaFormatterOrion(
            parseInt(subitem["amount"])
          );
        } else {
          // @ts-ignore
          airdropsMap.airdrops[subitem["denom"]] = lunaFormatter(
            parseInt(subitem["amount"])
          );
        }
      });
      airdropsMap.validatorInfo = item?.user_info?.validator_info;
      validatorAirdropInfo.push(airdropsMap);
    });
    setValidatorAirdrops(validatorAirdropInfo);
  }, []);

  let validatorFilterAirdrops = validatorAirdrops.filter(function (item: any) {
    return item?.airdrops?.anc != "0";
  });

  return (
    <Modal open onClose={() => closeDialog()} className="dialog">
      <Dialog className="stake-dialog-container" onClose={() => closeDialog()}>
        {!viewAirdropWithdraw && (
          <div className="stake-wrap">
            <p className="stake-dialog-title">Airdrops</p>
            <Grid container spacing={2}>
              <Grid item xs={4} md={4}>
                <p className="row-title">
                  Validators ({validatorFilterAirdrops?.length})
                </p>
              </Grid>
              <Grid item xs={4} md={4}>
                <p className="row-title txt-center">Airdrops</p>
              </Grid>
              <Grid item xs={4} md={4}></Grid>
            </Grid>
            {validatorFilterAirdrops.length > 0 &&
              validatorFilterAirdrops.map((item, index) => (
                <Grid container spacing={3} key={index}>
                  <Grid item xs={4} md={4}>
                    <p className="row-item">
                      <div className="flex v-center">
                        <div className="flex">
                          {config.network.name == "mainnet" ? (
                            <img
                              className="validatorImage"
                              src={
                                "/static/" +
                                item?.validatorInfo?.operator_address +
                                ".png"
                              }
                              alt=""
                            />
                          ) : (
                            <img
                              className="validatorImage"
                              src={
                                "/static/terravaloper1t90gxaawul292g2vvqnr3g0p39tw5v6vsk5p96.png"
                              }
                              alt=""
                            />
                          )}
                        </div>
                        <div className="flex ml-2">
                          {item?.validatorInfo?.validator_name}
                        </div>
                      </div>
                    </p>
                  </Grid>
                  <Grid item xs={4} md={4} key={index}>
                    <div className="flex mr-2 legendAirdropValues">
                      <div className="flex items-center row-item">
                        <h1 className="font-normal text-white ">
                          {item?.airdrops?.anc}
                        </h1>
                        <div className="">
                          <p className="font-normal text-white airdrop-text">
                            ANC
                          </p>
                        </div>
                        <img
                          src="/static/anc.png"
                          alt="anc"
                          className="legendImage"
                        />
                        <span
                          className="airdrop-view "
                          onClick={() => {
                            toggleOpenViewAirdrops(item);
                          }}
                        >
                          ViewAll
                        </span>
                        {/*start view airdrops from here*/}
                      </div>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    md={4}
                    onClick={() => {
                      setViewAirdropWithdraw(isAirdropAmountNonZero(item));
                      openStakePlusAirdropsWithdrawDialog({
                        goBack: () => {
                          setViewAirdropWithdraw(false);
                        },
                        refreshPage,
                        validatorAirdropInfo: item,
                        walletAddress,
                        terra,
                        wallet,
                      });
                    }}
                  >
                    <p
                      className={
                        isAirdropAmountNonZero(item)
                          ? "row-item txt-right airdrop-withdraw-link"
                          : "row-item txt-right airdrop-withdraw-link withdraw-disabled"
                      }
                    >
                      Withdraw {">"}
                    </p>
                  </Grid>
                </Grid>
              ))}
          </div>
        )}
        {viewAirdropsDropdown && (
          <div className="dropdown-container">
            <ClickAwayListener onClickAway={onClickAwayViewAirdrops}>
              <div className="dropdown-box filterDropdown">
                <div className="filterDropdownContainer">
                  <div className="filter-item-list">
                    <div className="flex items-center">
                      <h2 className="font-normal text-white">
                        {viewAirdropData.airdrops.anc}
                      </h2>
                      <div className="ml-2 mr-1">
                        <p className="font-normal text-white">ANC</p>
                      </div>
                      <img
                        src="/static/anc.png"
                        alt="ANC"
                        height={12}
                        style={{ marginLeft: 8 }}
                        className="legendImage"
                      />
                    </div>
                    <div className="flex items-center">
                      <h2 className="font-normal text-white">
                        {viewAirdropData.airdrops.mir}
                      </h2>
                      <div className="ml-2 mr-1">
                        <p className="font-normal text-white">MIR</p>
                      </div>
                      <img
                        src="/static/mir.png"
                        alt="MIR"
                        height={12}
                        style={{ marginLeft: 8 }}
                        className="legendImage"
                      />
                    </div>

                    <div className="flex items-center">
                      <h2 className="font-normal text-white">
                        {viewAirdropData.airdrops.vkr}
                      </h2>
                      <div className="ml-2 mr-1">
                        <p className="font-normal text-white">VKR</p>
                      </div>
                      <img
                        src="/static/valkyrie.png"
                        alt="VKR"
                        height={12}
                        style={{ marginLeft: 8 }}
                        className="legendImage"
                      />
                    </div>
                    <div className="flex items-center">
                      <h2 className="font-normal text-white">
                        {viewAirdropData.airdrops.mine}
                      </h2>
                      <div className="ml-2 mr-1">
                        <p className="font-normal text-white">MINE</p>
                      </div>
                      <img
                        src="/static/pylon.png"
                        alt="MINE"
                        height={12}
                        style={{ marginLeft: 8 }}
                        className="legendImage"
                      />
                    </div>
                    <div className="flex items-center">
                      <h2 className="font-normal text-white">
                        {viewAirdropData.airdrops.orion}
                      </h2>
                      <div className="ml-2 mr-1">
                        <p className="font-normal text-white">ORION</p>
                      </div>
                      <img
                        src="/static/orion.png"
                        alt="ORION"
                        height={12}
                        style={{ marginLeft: 8 }}
                        className="legendImage"
                      />
                    </div>
                    <div className="flex items-center">
                      <h2 className="font-normal text-white">
                        {viewAirdropData.airdrops.twd}
                      </h2>
                      <div className="ml-2 mr-1">
                        <p className="font-normal text-white">TWD</p>
                      </div>
                      <img
                        src="/static/twd.png"
                        alt="TWD"
                        height={12}
                        style={{ marginLeft: 8 }}
                        className="legendImage"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ClickAwayListener>
          </div>
        )}
        {viewAirdropWithdraw && stakePlusAirdropsWithdrawElement}
      </Dialog>
    </Modal>
  );
}
