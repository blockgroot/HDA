import Logo from "../../atoms/Logo/Logo";
import WalletSelector from "../../molecules/WalletSelector/WalletSelector";
import styles from "./Header.module.scss";
import { Drawer, IconButton, useMediaQuery } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { Typography } from "../../atoms";
import Icon from "../../atoms/Icon/Icon";
import { useState } from "react";
import Sidebar from "@molecules/Sidebar";
import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";
import { ButtonOutlined } from "@atoms/Button/Button";
import { config } from "config/config";

export default function Header() {
  const [open, setOpen] = useState(false);

  const openDrawer = () => {
    setOpen(true);
  };
  const closeDrawer = () => {
    setOpen(false);
  };

  const tabletDown = useMediaQuery(`(max-width:${MQ_FOR_TABLET_LANDSCAPE}px)`);
  const buyHbarHandle = () => window.open(config.hbar_pay_url, "_blank");
  return (
    <div className={styles.header}>
      <div className={styles.main}>
        <a href="https://staderlabs.com" target="_blank" rel="noreferrer">
          <Logo className={styles.logo} withTitle />
        </a>
        <div className={styles.wallet_menu}>
          <div className={styles.wallet_button} style={{ display: "flex" }}>
            <WalletSelector iconOnly={tabletDown} />
            <ButtonOutlined
              className="text-white px-4 ml-4 "
              size="small"
              onClick={buyHbarHandle}
            >
              <Typography
                variant={"body2"}
                fontWeight={"bold"}
                className={"mr-1"}
              >
                Buy HBAR
              </Typography>
              <Icon name="token_icon" height={20} width={20} />
            </ButtonOutlined>
          </div>

          <div className={styles.menu_button}>
            <IconButton onClick={openDrawer} className="text-white">
              <Menu />
            </IconButton>
          </div>
        </div>
      </div>
      <Drawer open={open} onClose={closeDrawer}>
        <Sidebar onClose={closeDrawer} />
      </Drawer>
    </div>
  );
}
