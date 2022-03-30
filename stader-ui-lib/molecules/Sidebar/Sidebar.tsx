import CloseIcon from "@material-ui/icons/Close";
import styles from "./Sidebar.module.scss";
import HelpBtn from "@atoms/HelpBtn/Help";
import { useRouter } from "next/router";
import WalletSelector from "@molecules/WalletSelector/WalletSelector";

interface Props {
  onClose: () => void;
}

function Sidebar({ onClose }: Props) {
  const router = useRouter();

  const openModal = () => {};

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <img src="/static/Stader_logo_title.svg" alt="Stader" width="112" />
        <CloseIcon onClick={onClose} />
      </div>
      <div className={styles.list}>
        <WalletSelector />
      </div>
      <HelpBtn />
    </div>
  );
}

export default Sidebar;
