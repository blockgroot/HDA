import { ClickAwayListener, Menu, Popper } from "@material-ui/core";
import classNames from "classnames";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "./Dropdown.module.scss";

interface Props {
  dropdownElement?: ReactNode;
  children: ReactNode | ReactNode[];
  containerClasses?: string;
  anchorEl: any;
  onClose: () => void;
}

function Dropdown(props: Props) {
  const { dropdownElement, children, containerClasses, anchorEl, onClose } =
    props;
  const [open, setOpen] = useState(false);
  const handleOpen = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let isDocument: any = document;
    isDocument?.querySelector("body").addEventListener("click", () => {
      handleClose();
    });
  }, []);

  const containerStyles = classNames(
    styles.dropdown_container,
    containerClasses
  );

  return (
    <Menu
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      classes={{ paper: styles.menu_paper }}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <div className={containerStyles} onBlur={handleClose}>
        <div className="dropdown-box filterDropdown">{children}</div>
      </div>
    </Menu>
  );
}

export default Dropdown;
