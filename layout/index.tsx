import c from "classnames";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import React, { useState } from "react";
import Header from "../stader-ui-lib/organisms/Header/Header";
import styles from "./Layout.module.scss";

NProgress.configure({ showSpinner: false });
(Router as any).onRouteChangeStart = () => {
  NProgress.start();
};
(Router as any).onRouteChangeComplete = () => {
  NProgress.done();
};
(Router as any).onRouteChangeError = () => {
  NProgress.done();
};

function MainLayout(props: any) {
  const [hideSidebar, setHideSidebar] = useState<Boolean>(true);

  return (
    <>
      <Head>
        <title>Stader</title>
      </Head>

      <Header />
      <div
        className={c(
          styles.mainContent,
          styles.noBanner,
          !hideSidebar && styles.sidebarVisible
        )}
      >
        <div className={c("layout-child", styles.layoutChild)}>
          <div className={"layout-child-container"}>{props.children}</div>
        </div>
      </div>
    </>
  );
}

export default MainLayout;
