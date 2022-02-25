import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";
import {
  Dialog,
  IconProps,
  Modal,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import { TooltipProps } from "@terra-dev/neumorphism-ui/components/Tooltip";
import classNames from "classnames";
import { useState } from "react";
import { Typography } from "..";
import styles from "./SDTooltip.module.scss";

interface Props extends Omit<TooltipProps, "title" | "children"> {
  content: any;
  fontSize?: "small" | "large" | "default" | "inherit" | "medium";
}

export default function SDTooltip({ content, className, fontSize }: Props) {
  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };

  return (
    <>
      <span className={styles.desktop}>
        <Tooltip
          title={content}
          classes={{ tooltip: "tooltip", arrow: "arrow" }}
          placement={"bottom"}
          arrow
        >
          <InfoOutlined className={className} fontSize={fontSize} />
        </Tooltip>
      </span>
      <span className={styles.mobile}>
        <InfoOutlined
          className={className}
          onClick={openModal}
          fontSize={fontSize}
        />
        <Dialog
          open={modal}
          onClose={closeModal}
          classes={{ paper: styles.dialog }}
        >
          <Typography variant="body1">{content}</Typography>
        </Dialog>
      </span>
    </>
  );
}
