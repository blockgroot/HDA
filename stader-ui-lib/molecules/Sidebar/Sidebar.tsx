import CloseIcon from "@material-ui/icons/Close";
import NavItem from "./NavItem";
import styles from "./Sidebar.module.scss";
import HelpBtn from "@atoms/HelpBtn/Help";
import { routes } from "@constants/routes";
import { useRouter } from "next/router";
import Link from "next/link";
import c from "classnames";

interface Props {
  onClose: () => void;
}

function Sidebar({ onClose }: Props) {
  const router = useRouter();

  const stakerouteLink = {
    title: "Stake",
    path: "/stake-plus",
    symbal: "+",
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <img src="/static/Stader_logo_title.svg" alt="Stader" width="112" />
        <CloseIcon onClick={onClose} />
      </div>
      <div className={styles.list}>
        {routes.map((route) => (
          <NavItem
            route={route}
            activePage={router.pathname}
            key={route.title}
          />
        ))}
        <div
          className={c(styles.routeLink, {
            [styles.active]: router.pathname === "/stake-plus",
          })}
        >
          <Link href={stakerouteLink.path} key={stakerouteLink.path}>
            {stakerouteLink.title}
          </Link>
          {stakerouteLink.symbal ? (
            <span className={c(styles.textSuper)}>{stakerouteLink.symbal}</span>
          ) : (
            ""
          )}
        </div>
      </div>
      <HelpBtn />
    </div>
  );
}

export default Sidebar;
