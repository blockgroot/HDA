import { Backdrop, IconButton, Portal } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import { ReactNode, useEffect } from "react";
import styles from "./BottomModal.module.scss";

interface Props {
  onClose: () => void;
  children: ReactNode;
  open: boolean;
}

function BottomModal(props: Props) {
  const mainRoot = document.getElementById("main-root");
  const { onClose, children, open } = props;

  return (
    <Portal container={mainRoot}>
      <Backdrop className={styles.backdrop} open={open} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <IconButton onClick={onClose} className={styles.close_button}>
            <CloseOutlined />
          </IconButton>
          {children}
        </div>
      </Backdrop>
    </Portal>
  );
}

export default BottomModal;
