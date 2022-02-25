import Logo from "../../atoms/Logo/Logo";
import WalletSelector from "../../molecules/WalletSelector/WalletSelector";
import styles from "./Header.module.scss";
import { Drawer, IconButton, useMediaQuery } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { useState } from "react";
import Sidebar from "@molecules/Sidebar";
import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";

export default function Header() {
  const [open, setOpen] = useState(false);

  const openDrawer = () => {
    setOpen(true);
  };
  const closeDrawer = () => {
    setOpen(false);
  };

  const tabletDown = useMediaQuery(`(max-width:${MQ_FOR_TABLET_LANDSCAPE}px)`);

  return (
    <div className={styles.header}>
      <div className={styles.main}>
        <a href="https://staderlabs.com" target="_blank" rel="noreferrer">
          <Logo className={styles.logo} withTitle />
        </a>
        <div className={styles.wallet_menu}>
          <div className={styles.wallet_button}>
            <WalletSelector iconOnly={tabletDown} />
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
