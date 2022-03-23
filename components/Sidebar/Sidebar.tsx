import { FC, useEffect } from "react";
import c from "classnames";
import CloseIcon from "@material-ui/icons/Close";

import NavItem from "./NavItem";
import styles from "./Sidebar.module.scss";
import Help from "../common/Help";
import { routes } from "@constants/routes";

interface Props {
  activePage: string;
  hide?: Boolean;
  onToggleSidebar?: (hide: Boolean) => void;
}

const Sidebar: FC<Props> = ({
  activePage,
  hide = false,
  onToggleSidebar = () => {},
}: Props) => {
  return (
    <div className={c(styles.sidebar, hide ? styles.hide : styles.show)}>
      <div className={styles.header}>
        <img src="/static/Stader_logo_title.svg" alt="Stader" width="112" />
        <CloseIcon onClick={() => onToggleSidebar(!hide)} />
      </div>
      <div className={styles.wrap}>
        {routes.map((route) => (
          <NavItem route={route} activePage={activePage} key={route.title} />
        ))}
      </div>
      <div className={styles.ovl} onClick={() => onToggleSidebar(!hide)} />
      <div style={{ flex: 1 }} />
      <Help className={styles.helpBtn} />
    </div>
  );
};

export default Sidebar;
