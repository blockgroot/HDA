import Logo from "../../atoms/Logo/Logo";
import WalletSelector from "../../molecules/WalletSelector/WalletSelector";
import styles from "./Header.module.scss";
import { Dialog, Drawer, IconButton, useMediaQuery } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { Box, Typography } from "../../atoms";
import Icon from "../../atoms/Icon/Icon";
import { useEffect, useState } from "react";
import Sidebar from "@molecules/Sidebar";
import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";
import { ButtonOutlined } from "@atoms/Button/Button";
import { config } from "config/config";
import { getAnalytics, logEvent } from "firebase/analytics";
import { StorageService } from "@services/storage.service";
import CloseIcon from "@material-ui/icons/Close";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [modal, setModalOpen] = useState(false);
  const [banxaTermsAccepted, setBanxaTermsAccepted] = useState<boolean>();

  useEffect(() => {
    setBanxaTermsAccepted(StorageService.isBanxaTermsAccepted());
    return;
  });

  const openDrawer = () => {
    setOpen(true);
  };
  const closeDrawer = () => {
    setOpen(false);
  };

  const tabletDown = useMediaQuery(`(max-width:${MQ_FOR_TABLET_LANDSCAPE}px)`);
  const banxaTermsAcceptedHandle = (accepted: boolean) => {
    setBanxaTermsAccepted(accepted);
    StorageService.setBanxaTermsAccepted(accepted);
  };
  const handleBuyHbar = () => {
    const analytics = getAnalytics();
    logEvent(analytics, "buy_hbar_click");
    setModalOpen(false);
    window.open(config.hbar_buy_url, "_blank");
  };
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
              onClick={() =>
                !banxaTermsAccepted ? setModalOpen(true) : handleBuyHbar()
              }
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
      <Dialog
        open={modal}
        onClose={() => setModalOpen(false)}
        classes={{ paper: styles.dialog }}
      >
        <Box className={styles.dialog__root}>
          <div
            className="justify-center flex p-2"
            style={{ textAlign: "center" }}
          >
            <Typography variant={"h2"}>Disclaimer</Typography>
          </div>
          <CloseIcon
            onClick={() => setModalOpen(false)}
            className={styles.dialog_close_icon}
          />
          <div
            className="justify-center flex p-3 mb-3"
            style={{ textAlign: "center" }}
          >
            <Typography variant={"body3"}>
              You are being directed to a third-party platform. Please be aware
              that the new platform may have risks and terms different from
              those of Stader. Stader does not have the ability to verify the
              platform or ascertain the risks associated with it. Users are
              advised to proceed at their own risk and assess the security, and
              terms of service of the new platform independently before
              transacting
            </Typography>
          </div>
          <div className="justify-center flex">
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="accept_away"
                checked={banxaTermsAccepted}
                onChange={(e) => banxaTermsAcceptedHandle(e.target.checked)}
              />
              <span className="text-white">
                I understand the risk and wish to proceed
              </span>
            </label>
          </div>
          <div className="justify-center flex p-4">
            <ButtonOutlined
              className="w-[200px] h-[48px]"
              type="submit"
              onClick={handleBuyHbar}
              disabled={!banxaTermsAccepted}
            >
              OK
            </ButtonOutlined>
          </div>
        </Box>
      </Dialog>
    </div>
  );
}
