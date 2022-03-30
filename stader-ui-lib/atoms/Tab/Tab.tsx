import { TabsType, TabType } from "./Tab.type";
import classNames from "classnames";
import React, { ReactElement, ReactNode, useState } from "react";
import styles from "./Tab.module.scss";

export function Tab(props: TabType) {
  const { active, label, value, onChange, subText } = props;
  const tabClasses = classNames(styles.tab_root, {
    [styles.tab_active]: active,
    [styles.tab_inactive]: !active,
  });

  const handleChange = () => {
    if (onChange) {
      onChange(value);
    }
  };
  return (
    <div className={tabClasses} onClick={handleChange}>
      {label}
      {subText && <span className={styles.tab_subtext}>{subText}</span>}
    </div>
  );
}

export function Tabs(props: TabsType) {
  const { children, onChange, value } = props;
  const [state, setState] = useState<number>(value);

  const handleChange = (value: number) => {
    setState(value);
    if (onChange) {
      onChange(value);
    }
  };

  const newChildren = React.Children.map(
    children,
    (child: ReactNode, index: number) => {
      return React.cloneElement(child as ReactElement<TabType>, {
        onChange: handleChange,
        active: index === state,
      });
    }
  );

  const tabsClasses = classNames(styles.tabs);

  return <div className={tabsClasses}>{newChildren}</div>;
}

Tabs.defaultProps = {
  value: 0,
};
