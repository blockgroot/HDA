import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, ClickAwayListener } from "@material-ui/core";

import { config } from "../../config/config";
import {
  getUserSdRewards,
  getUserStakingAirdrops,
  getUserStakingRewards,
} from "../../services/rewards";

import withMediaQuery from "../../media_query";
import InfoPageMobile from "../common/InfoPageMobile";
import CommunityFarming from "./CommunityFarming";
import { InfoOutlined } from "@material-ui/icons";
import { lunaFormatter, lunaFormatterOrion } from "../../utils/CurrencyHelper";
import Loader from "../common/Loader";
import { defaultAirdrops, PAGE_LOADER_TEXT } from "../../constants/constants";
import { WalletStatus } from "@terra-money/wallet-provider";
import { useAirdropsLiquidTokenDialog } from "../../dialogs/useAirdropsLiquidTokenDialog";
import SdRewardsVesting from "../SdRewardsVesting/SdRewardsVesting";

const {
  liquidStaking: contractAddress,
  cw20: tokenAddress,
  airdropsContract,
} = config.contractAddresses;

type WalletFunds = {
  uusd: number;
  uluna: number;
};

type Props = {
  walletFunds: WalletFunds;
  wallet?: any;
  terra?: any;
  mediaQuery: boolean;
  walletStatus?: any;
  primaryWalletAddress?: string;
};

const airdropsDetail: any = {
  anc: {
    path: "/static/anc.png",
  },
  mir: {
    path: "/static/mir.png",
  },
  mine: {
    path: "/static/pylon.png",
  },
  orion: {
    path: "/static/orion.png",
  },
  vkr: {
    path: "/static/valkyrie.png",
  },
  twd: {
    path: "/static/twd.png",
  },
};

const Rewards: FC<Props> = ({
  primaryWalletAddress,
  terra,
  wallet,
  walletFunds,
  walletStatus,
  mediaQuery,
}) => {
  const router = useRouter();
  const isLiquidStaking = router.pathname.indexOf("lt") > -1;
  const [openAirdropsLiquidTokenDialog, airdropsLiquidTokenDialogElement] =
    useAirdropsLiquidTokenDialog();
  const [viewAirdropsDropdown, setViewAirdropsDropdown] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDeviceMobile, setIsDeviceMobile] = useState(false);
  const [totalFarmedInfo, setTotalFarmedInfo] = useState({
    deltaInRewards: 0,
    deltaInSdTokens: 0,
    lastTimestamp: 0,
    lunaPrice: 0,
    sdTokenPrice: 0,
    totalRewards: 0,
    totalSdTokens: 0,
  });

  const [userFarmedInfo, setUserFarmedInfo] = useState({
    totalSdTokens: 0,
    totalRewards: 0,
    deltaInSdTokens: 0,
    deltaInRewards: 0,
  });
  const [airdrops, setAirdrops] = useState<any[]>([]);

  useEffect(() => {
    if (primaryWalletAddress) {
      fetchSDRewards(primaryWalletAddress);
    }

    if (mediaQuery !== isDeviceMobile) {
      setIsDeviceMobile(mediaQuery);
    }
  }, [primaryWalletAddress, mediaQuery]);

  useEffect(() => {
    if (walletStatus === WalletStatus.WALLET_NOT_CONNECTED) {
      setIsPageLoading(false);
    }
  }, [walletStatus]);

  const onClickAwayViewAirdrops = () => {
    setViewAirdropsDropdown(false);
  };

  const toggleOpenViewAirdrops = () => {
    setViewAirdropsDropdown(!viewAirdropsDropdown);
  };

  const refreshPage = (walletAddress: string) => {
    setIsPageLoading(true);
    setTimeout(() => {
      fetchSDRewards(walletAddress);
    }, 2000);
  };

  const fetchSDRewards = async (walletAddress: string) => {
    const [rewards, airdropsInfo]: any = await Promise.all([
      getUserSdRewards(walletAddress),
      terra.wasm.contractQuery(airdropsContract, {
        get_user_token_info: {
          user: walletAddress,
        },
      }),
    ]);

    const userInfo = {
      totalSdTokens: rewards.totalSdTokens,
      totalRewards: rewards.totalBalance,
      deltaInSdTokens: rewards.deltaInSdTokens,
      deltaInRewards: rewards.deltaInBalance,
    };

    const totalAirdrops =
      airdropsInfo &&
      airdropsInfo.user_tokens &&
      airdropsInfo.user_tokens.length > 0
        ? airdropsInfo.user_tokens
        : defaultAirdrops;

    setUserFarmedInfo(userInfo);
    setAirdrops(totalAirdrops);
    setIsPageLoading(false);
  };

  const canWithdrawAirdrops = () => {
    const areAirdropsPresent = airdrops.some((airdrop: any) => {
      return parseInt(airdrop.amount) > 1000;
    });

    return areAirdropsPresent;
  };

  if (isDeviceMobile) {
    return (
      <div style={{margin: "0 20px"}}>
        <InfoPageMobile />
      </div>
    );
  }
	
  
  return (
    <div
      className={
        isDeviceMobile
          ? "layout-child-container-mobile"
          : "layout-child-container"
      }
    >
      {isPageLoading || walletStatus === WalletStatus.INITIALIZING ? (
        <div>
          <Loader
            classes={"loaderContainer loaderContainer60"}
            loaderText={PAGE_LOADER_TEXT}
          />
        </div>
      ) : isDeviceMobile ? (
        <div className="rewards-container">
          <InfoPageMobile />
        </div>
      ) : (
        <div className="rewards-container">
          <div className="card-title">Community Farming</div>
          <div className="community-farming-card">
            <CommunityFarming
              isLiquidStaking={isLiquidStaking}
              totalFarmedRewards={totalFarmedInfo}
              userFarmedRewards={userFarmedInfo}
            />
          </div>

          <div className="card-title">Airdrops</div>
          <div className="airdrops-card">
            <div className="airdropsContentInfo">
              {airdrops.map((airdrop: any, index: number) => {
                let name = airdrop.denom;
                let amount = airdrop.amount;
                return index <= 2 ? (
                  <div className="airdropsContent" key={`airdrop-${name}`}>
                    <p className="airdropsContentText">
                      {name === "orion"
                        ? lunaFormatterOrion(amount)
                        : lunaFormatter(amount)}{" "}
                      <span className="airdropsContentTextSmall">
                        {name}{" "}
                        <img
                          src={airdropsDetail[name].path}
                          alt={name}
                          height={12}
                          style={{ marginLeft: 8 }}
                        />
                      </span>
                    </p>
                  </div>
                ) : null;
              })}
              {airdrops.length > 2 ? (
                <div>
                  <ClickAwayListener onClickAway={onClickAwayViewAirdrops}>
                    <div className="filter">
                      <div
                        className="legendsViewAll"
                        onClick={() => toggleOpenViewAirdrops()}
                      >
                        View All
                      </div>
                      {viewAirdropsDropdown && (
                        <div className="dropdown-container">
                          <div className="dropdown-box filterDropdown">
                            <div className="filterDropdownContainer">
                              {airdrops.map((airdrop: any, index: number) => {
                                let name = airdrop.denom;
                                let amount = airdrop.amount;
                                return (
                                  <div
                                    className="filterItem"
                                    key={`airdrop-${name}`}
                                  >
                                    <p className="legendValue">
                                      {name === "orion"
                                        ? lunaFormatterOrion(amount)
                                        : lunaFormatter(amount)}{" "}
                                      <span className="airdropsContentTextSmall">
                                        {name}{" "}
                                        <img
                                          src={airdropsDetail[name].path}
                                          alt={name}
                                          height={12}
                                          style={{ marginLeft: 8 }}
                                        />
                                      </span>
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ClickAwayListener>
                </div>
              ) : null}
            </div>

            <Button
              className="borderdButton"
              disabled={!canWithdrawAirdrops()}
              disableRipple
              disableTouchRipple
              disableFocusRipple
              onClick={() => {
                openAirdropsLiquidTokenDialog({
                  primaryWalletAddress: primaryWalletAddress || "",
                  contractAddress: airdropsContract,
                  airdrops,
                  wallet,
                  refreshPage,
                  terra,
                  walletFunds,
                });
              }}
            >
              Withdraw
            </Button>
          </div>
        </div>
      )}
      <SdRewardsVesting isLiquidStaking />
      {airdropsLiquidTokenDialogElement}
    </div>
  );
};

export default withMediaQuery("(max-width:1024px)")(Rewards);
