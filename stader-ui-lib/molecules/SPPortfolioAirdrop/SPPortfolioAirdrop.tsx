import React, { useState } from "react";
import { lunaFormatter, lunaFormatterOrion } from "@utils/CurrencyHelper";
import { Airdrop, Typography } from "../../atoms";
import styles from "./SPPortfolioAirdrop.module.scss";
import { AirdropsType } from "@types_/portfolio";
import Dropdown from "../../atoms/Dropdown/Dropdown";
import { ClickAwayListener, Popper, useMediaQuery } from "@material-ui/core";
import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";

interface Props {
  airdrops: AirdropsType;
  show?: number;
}

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
    <Airdrop
      label={
        <Typography className={styles.airdrop_label} variant={"body2"}>
          {label}
        </Typography>
      }
      value={
        <Typography variant={"h2"} className={styles.airdrop_value}>
          {value}
        </Typography>
      }
      icon={<img src={iconPath} alt={label} className={styles.airdrop_image} />}
    />
  );
}

function SPPortfolioAirdrop(props: Props) {
  const { airdrops, show } = props;
  const { mir, mine, vkr, anc, twd, orion } = airdrops;
  const [showOtherAirdrops, setShowOtherAirdrops] = useState(false);

  const tabletUp = useMediaQuery(`(min-width: ${MQ_FOR_TABLET_LANDSCAPE}px)`);

  const hiddenAirdrops = () => {
    return (
      <>
        <AirdropCustomized
          label={"MIR"}
          value={lunaFormatter(mir.amount)}
          iconPath={"/static/mir.png"}
        />
        <AirdropCustomized
          label={"ORION"}
          value={lunaFormatterOrion(orion.amount)}
          iconPath={"/static/orion.png"}
        />
        <AirdropCustomized
          label={"MINE"}
          value={lunaFormatter(mine.amount)}
          iconPath={"/static/pylon.png"}
        />
        <AirdropCustomized
          label={"TWD"}
          value={lunaFormatter(twd.amount)}
          iconPath={"/static/twd.png"}
        />
      </>
    );
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleModalOpen = (e: any) => {
    // console.log("hiadsfasds");
    setAnchorEl(e.currentTarget);
    // console.log(anchorEl);
  };

  console.log(anchorEl);
  const handleModalClose = () => {
    setAnchorEl(null);
    console.log("test");
  };

  const hiddenAirdropsMobile = () => {
    return (
      <>
        <AirdropCustomized
          label={"ORION"}
          value={lunaFormatterOrion(orion.amount)}
          iconPath={"/static/orion.png"}
        />
        <AirdropCustomized
          label={"TWD"}
          value={lunaFormatter(twd.amount)}
          iconPath={"/static/twd.png"}
        />

        <AirdropCustomized
          label={"VKR"}
          value={lunaFormatter(vkr.amount)}
          iconPath={"/static/valkyrie.png"}
        />
      </>
    );
  };
  return (
    <>
      <div className={styles.airdrop_wrap}>
        <AirdropCustomized
          label={"ANC"}
          value={lunaFormatter(anc.amount)}
          iconPath={"/static/anc.png"}
        />
        <AirdropCustomized
          label={"MIR"}
          value={lunaFormatter(mir.amount)}
          iconPath={"/static/mir.png"}
        />
        {show === 3 && (
          <AirdropCustomized
            label={"MINE"}
            value={lunaFormatter(mine.amount)}
            iconPath={"/static/pylon.png"}
          />
        )}

        {tabletUp && (
          <>
            <div onClick={handleModalOpen} className="cursor-pointer">
              <Typography
                variant={"body2"}
                color={"primary"}
                className={styles.view_all}
                fontWeight={"semi-bold"}
              >
                View All
              </Typography>
            </div>

            <Dropdown anchorEl={anchorEl} onClose={handleModalClose}>
              <div className={styles.airdrop_dropdown_container}>
                <AirdropCustomized
                  label={"ANC"}
                  value={lunaFormatter(anc.amount)}
                  iconPath={"/static/anc.png"}
                />

                <AirdropCustomized
                  label={"VKR"}
                  value={lunaFormatter(vkr.amount)}
                  iconPath={"/static/valkyrie.png"}
                />
                {hiddenAirdrops()}
              </div>
            </Dropdown>
          </>
        )}

        {/* {tabletUp && (
          <Dropdown
            dropdownElement={
              <Typography
                variant={"body2"}
                color={"primary"}
                className={styles.view_all}
                fontWeight={"semi-bold"}
              >
                View All
              </Typography>
            }
          >
            <div className={styles.airdrop_dropdown_container}>
              <AirdropCustomized
                label={"ANC"}
                value={lunaFormatter(anc.amount)}
                iconPath={"/static/anc.png"}
              />

              <AirdropCustomized
                label={"VKR"}
                value={lunaFormatter(vkr.amount)}
                iconPath={"/static/valkyrie.png"}
              />
              {hiddenAirdrops()}
            </div>
          </Dropdown>
        )} */}
      </div>
      {!tabletUp && (
        <div className={styles.mobile_other_airdrops}>
          <div
            className={
              showOtherAirdrops ? styles.show_other : styles.hide_other
            }
          >
            {hiddenAirdropsMobile()}
          </div>
          <Typography
            variant={"body2"}
            color={"primary"}
            className={styles.view_all}
            fontWeight={"semi-bold"}
            onClick={() => setShowOtherAirdrops((prev) => !prev)}
          >
            {showOtherAirdrops ? "Hide All" : "View All"}
          </Typography>
        </div>
      )}
    </>
  );
}

export default SPPortfolioAirdrop;
