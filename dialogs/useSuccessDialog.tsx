import React from "react";
import { Modal } from "@material-ui/core";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { useDialog } from "@terra-dev/use-dialog";

import SDButton from "../components/common/SDButton";
import SuccessAnimation from "../components/common/SuccessAnimation";

export function useSuccessDialog() {
  return useDialog(SuccessDialog);
}

interface Props {
  closeDialog?: any;
  refreshPage?: any;
  autoCompoundingDepositFraction: number;
  retainRewardsDepositFraction: number;
}

function SuccessDialog({
  closeDialog,
  refreshPage,
  autoCompoundingDepositFraction,
  retainRewardsDepositFraction,
}: Props) {
  const closeAndRefresh = () => {
    closeDialog();
    refreshPage();
  };

  return (
    <Modal open onClose={() => closeDialog()} className="dialog">
      <Dialog className="dialog-container" onClose={() => closeDialog()}>
        <div className="success-container">
          <div className="success-icon">
            <SuccessAnimation />
          </div>

          <p className="message">Your reward strategy has been changed.</p>
          <hr className="divider" />
          <p className="message">
            Auto Compounding - {autoCompoundingDepositFraction}%
          </p>
          <p className="message">
            Retain Rewards - {retainRewardsDepositFraction}%
          </p>
          <SDButton
            className="success-button"
            text="OK"
            onClick={() => closeAndRefresh()}
          />
        </div>
      </Dialog>
    </Modal>
  );
}
