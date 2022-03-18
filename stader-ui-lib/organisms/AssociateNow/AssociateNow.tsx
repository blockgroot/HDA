import AssociateNowStart from "@molecules/AssociateNowStart/AssociateNowStart";
import { Box, Loader } from "@atoms/index";
import styles from "./AssociateNow.module.scss";
import React, { useCallback, useState } from "react";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { Modal } from "@material-ui/core";
import AssociateModalSuccess from "@molecules/AssociateModalSuccess/AssociateModalSuccess";



function AssociateNow() {
  const [showLoadingModal, setIsShowLoadingModal] = useState<boolean>(false);
  const [isLoadAssociate, setIsLoadAssociate] = useState<boolean>(false);
  const [isAssociated, setAssociated] = useState<boolean>(false);

  const sendTransaction = useCallback(() => {
    setTimeout(() => {
      setIsLoadAssociate(false);
      setAssociated(true);
    }, 5000);
  }, [])

  const onClickAssociateHandler = useCallback(() => {
    setIsShowLoadingModal(true);
    setIsLoadAssociate(true);

    sendTransaction();

  }, [setIsShowLoadingModal, sendTransaction, setIsLoadAssociate]);


  const onCloseModalHandler = useCallback(() => {
    setIsLoadAssociate(false);
    setAssociated(false);
    setIsShowLoadingModal(false);
  }, [])
  return <>
    <Box className={"mb-10 p-0"}>
      <div className={styles.root}>
        <AssociateNowStart onClickAssociate={onClickAssociateHandler} />
      </div>
    </Box>
    {
      showLoadingModal &&
      (
        <Modal open={true} className="dialog">
          <Dialog className="dialog-container" onClose={isAssociated ? onCloseModalHandler : null}>
            {isLoadAssociate && (<Loader text={"Please wait while we set things up for you"} />)}
            {isAssociated && (<AssociateModalSuccess onClickStartStaking={onCloseModalHandler} />)}
          </Dialog>
        </Modal>
      )
    }
  </>;
}

export default AssociateNow;