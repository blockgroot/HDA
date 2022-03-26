import { FC, useState } from "react";
import c from "classnames";
import Link from "next/link";

import styles from "./NavItem.module.scss";

interface Props {
  route: Route;
  activePage: string;
}

interface Page {
  label: string;
  path: string;
}

export interface Route {
  title: string;
  pages: Page[];
}

const NavItem: FC<Props> = ({ route, activePage }) => {
  const isActive = route.pages.some((page) => page.path === activePage);
  const [isExpanded, setExpanded] = useState<boolean>(isActive);

  const toggleExpand = () => {
    setExpanded(!isExpanded);
  };

  return (
    <>
      <div
        onClick={toggleExpand}
        className={c(styles.route, { [styles.active]: isExpanded })}
      >
        <span>{route.title}</span>
        <span className={c(styles.chevron, { [styles.active]: isExpanded })}>
          &rsaquo;
        </span>
      </div>
      {isExpanded
        ? route.pages.map((page) => (
            <Link href={page.path} key={page.path}>
              <span
                className={c(styles.link, {
                  [styles.active]: activePage === page.path,
                })}
              >
                {page.label}
              </span>
            </Link>
          ))
        : null}
    </>
  );
};

export default NavItem;
