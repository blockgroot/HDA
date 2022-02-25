import { Routes } from "@types_/routes";

export const routes: Routes[] = [
  {
    title: "Stake Pools",
    pages: [
      {
        label: "Pools",
        path: "/pools",
      },
      {
        label: "Strategies",
        path: "/strategies",
      },
      {
        label: "Portfolio",
        path: "/portfolio",
      },
    ],
  },
  {
    title: "Liquid Staking",
    pages: [
      {
        label: "Pools",
        path: "/lt-pools",
      },
      {
        label: "Rewards",
        path: "/lt-rewards",
      },
    ],
  },
];
