import AssociateNowStart from "@molecules/AssociateNowStart/AssociateNowStart";
import { Box, Loader } from "@atoms/index";
import styles from "./AssociateNow.module.scss";
import React, { useCallback, useEffect, useState } from "react";
import { Dialog } from "@terra-dev/neumorphism-ui/components/Dialog";
import { Modal } from "@material-ui/core";
import AssociateModalSuccess from "@molecules/AssociateModalSuccess/AssociateModalSuccess";
import AssociateNowComplete from "@molecules/AssociateNowComplete/AssociateNowComplete";
import { Client, TokenAssociateTransaction, Status, PrivateKey, AccountBalanceQuery } from "@hashgraph/sdk";

interface AssociateNowProps {
  isAssociated: boolean
  tokenId: string
  account: {
    accountId: string
    privateKey: string
  }
  client: Client
}


function AssociateNow(props: AssociateNowProps) {
  const [showLoadingModal, setIsShowLoadingModal] = useState<boolean>(false);
  const [isLoadAssociate, setIsLoadAssociate] = useState<boolean>(false);
  const [isAssociated, setIsAssociated] = useState<boolean>(props.isAssociated);
  const [isLoadCheckAssociated, setIsLoadCheckAssociated] = useState(true);


  const sendTransactionAssociate = useCallback(async () => {
    try {

      const transaction = await new TokenAssociateTransaction()
        .setAccountId(props.account.accountId)
        .setTokenIds([props.tokenId])
        .freezeWith(props.client);

      const signTx = await transaction.sign(PrivateKey.fromString(props.account.privateKey));
      const txResponse = await signTx.execute(props.client);
      const receipt = await txResponse.getReceipt(props.client);

      const transactionStatus = receipt.status;

      console.log(receipt);

      console.log("The transaction consensus status " + transactionStatus.toString());

      if (transactionStatus === Status.Success) {
        setIsAssociated(true);
        setIsLoadAssociate(false);
      }

    } catch (e) {
      console.error(e);
      // if (e.status === Status.TokenAlreadyAssociatedToAccount) {
      //   console.log("!!! TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT");
      // }
    }
  }, []);

  useEffect(() => {
    const client = Client.forTestnet();
    client.setOperator(props.account.accountId, props.account.privateKey);

    const query = new AccountBalanceQuery()
      .setAccountId(props.account.accountId);

    query.execute(client).then(({ tokens }) => {
      setIsLoadCheckAssociated(false);
      setIsAssociated(Boolean(tokens?.get(props.tokenId)));
    });

  }, [props.account]);

  const onClickAssociateHandler = useCallback(() => {
    setIsShowLoadingModal(true);
    setIsLoadAssociate(true);

    sendTransactionAssociate();

  }, [setIsShowLoadingModal, sendTransactionAssociate, setIsLoadAssociate]);


  const onCloseModalHandler = useCallback(() => {
    setIsLoadAssociate(false);
    setIsShowLoadingModal(false);
  }, []);

  const onClickStartStaking = useCallback(() => {

  }, []);

  return <>
    <Box className={"mb-10 p-0"}>
      <div className={styles.root}>
        {isLoadCheckAssociated && (<Loader text={"Please wait while we set things up for you"} />)}
        {!isLoadCheckAssociated && isAssociated && (<AssociateNowComplete onClickStartStaking={onClickStartStaking} />)}
        {!isLoadCheckAssociated && !isAssociated && (<AssociateNowStart onClickAssociate={onClickAssociateHandler} />)}
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