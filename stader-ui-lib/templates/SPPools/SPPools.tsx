import SPPoolTVL from "../../molecules/SPPoolTVL/SPPoolTVL";
import SPPoolsTooltips from "@organisms/SPPoolsTooltips/SPPoolsTooltips";
import CFPoolTable from "../../organisms/SPPoolTable/SPPoolTable";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { useAppContext } from "@libs/appContext";
import { Loader, Typography } from "../../atoms";
import { PAGE_LOADER_TEXT } from "@constants/constants";
import styles from "./SPPools.module.scss";
import { Breadcrumbs } from "@atoms/index";
import SPPoolWelcomeBox from "@molecules/WelcomeBoxes/SPPoolWelcomeBox";

export default function SPPools() {
  const { status } = useWallet();
  const { walletAddress } = useAppContext();
  if (status === WalletStatus.INITIALIZING)
    return <Loader text={PAGE_LOADER_TEXT} />;

  if (status === WalletStatus.WALLET_NOT_CONNECTED || !walletAddress)
    return <SPPoolWelcomeBox />;

  const breadcrumbsContent = [
    <Typography color="textSecondary" key={1}>
      Stake Pools
    </Typography>,
    <Typography key={2}>Pools</Typography>,
  ];

  return (
    <div>
      <div className={styles.breadcrumbs}>
        <Breadcrumbs>{breadcrumbsContent}</Breadcrumbs>
      </div>
      <div className={styles.tvl_tooltips_container}>
        <div className={styles.tvl_container}>
          <SPPoolTVL />
        </div>
        <SPPoolsTooltips />
      </div>
      <div className={styles.table}>
        <CFPoolTable />
      </div>
    </div>
  );
}
