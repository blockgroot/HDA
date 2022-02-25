import React from "react";
import { Typography } from "../../atoms";
import styles from "./SPPortfolioTabsHead.module.scss";

interface Props {
  onClick: (value: PortfolioTabValues) => void;
  activeTab: PortfolioTabValues;
}

export enum PortfolioTabValues {
  COMMUNITY_FARMING = "community-farming",
  MY_HOLDINGS = "my-holdings",
  MANAGE_HOLDINGS = "manage-holdings",
}

const tabs: Array<{ label: string; value: PortfolioTabValues }> = [
  { label: "Community Farming", value: PortfolioTabValues.COMMUNITY_FARMING },
  { label: "My Holdings", value: PortfolioTabValues.MY_HOLDINGS },
  { label: "Manage Holdings", value: PortfolioTabValues.MANAGE_HOLDINGS },
];

export default function SPPortfolioTabsHead({ onClick, activeTab }: Props) {
  const handleClick = (value: PortfolioTabValues) => () => {
    onClick(value);
  };
  return (
    <div className={styles.root}>
      {tabs.map((tab) => (
        <div
          key={tab.value}
          onClick={handleClick(tab.value)}
          className={
            activeTab === tab.value ? styles.active_wrap : styles.inactive_wrap
          }
        >
          <Typography
            variant={"h3"}
            fontWeight={activeTab === tab.value ? "bold" : "normal"}
            color={activeTab === tab.value ? "secondary" : "textSecondary"}
            className={styles.label}
          >
            {tab.label}
          </Typography>
        </div>
      ))}
    </div>
  );
}
