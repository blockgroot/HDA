import { FC, useEffect } from "react";
import c from "classnames";
import CloseIcon from "@material-ui/icons/Close";

import NavItem, { Route } from "./NavItem";
import styles from "./Sidebar.module.scss";
import Help from "../common/Help";
import Link from "next/link";

interface Props {
  activePage: string;
  hide?: Boolean;
  onToggleSidebar?: (hide: Boolean) => void;
}

const routes: Route[] = [
  // {
  //   title: "Stake Pools",
  //   pages: [
  //     {
  //       label: "Pools",
  //       path: "/pools",
  //     },
  //     {
  //       label: "Strategies",
  //       path: "/strategies",
  //     },
  //     {
  //       label: "Portfolio",
  //       path: "/portfolio",
  //     },
  //   ],
  // },
  {
    title: "Liquid Staking",
    pages: [
      {
        label: "Pools",
        path: "/lt-pools",
      },
      // {
      //   label: "Rewards",
      //   path: "/lt-rewards",
      // },
    ],
  },
];
// const coinlistRoute = {
// 	title: "CoinList Sale",
// 	path: "/coinlist-sale",
// }

const stakerouteLink = {
  title: "Stake",
  path: "/stake-plus",
  symbal: "+",
};

const Sidebar: FC<Props> = ({
  activePage,
  hide = false,
  onToggleSidebar = () => {},
}: Props) => {
  const currentRouteIsStakePlus = activePage;
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
      <div style={{ flex: 1 }}></div>
      <Help className={styles.helpBtn} />
    </div>
  );
};

export default Sidebar;
