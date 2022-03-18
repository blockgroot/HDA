import CloseIcon from "@material-ui/icons/Close";
import NavItem from "./NavItem";
import styles from "./Sidebar.module.scss";
import HelpBtn from "@atoms/HelpBtn/Help";
import { routes } from "@constants/routes";
import { useRouter } from "next/router";

interface Props {
  onClose: () => void;
}

function Sidebar({ onClose }: Props) {
  const router = useRouter();

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
      </div>
      <HelpBtn />
    </div>
  );
}

export default Sidebar;
