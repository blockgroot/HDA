


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
     TransactionId,AccountId,Transaction,PrivateKey
  } from "@hashgraph/sdk";
  import type { NextApiRequest, NextApiResponse } from 'next';



  type Data = {
    result: string
  };

  
  
  const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
  ) => {
  
    
    const body = JSON.parse(req.body)

    let trans = body.trans;
    trans = Transaction.fromBytes(trans)
    const signingAcctId = body.signingAcctId;
    let nodeId = [new AccountId(3)];
    let transId = TransactionId.generate(signingAcctId)

    trans.setNodeAccountIds(nodeId);
    trans.setTransactionId(transId);
    
    trans =  trans.freeze();

    let transBytes = trans.toBytes();

    const privKey = PrivateKey.fromString(process.env.OPERATOR_KEY as string);
    const pubKey = privKey.publicKey;

    const sig =  privKey.signTransaction(Transaction.fromBytes(transBytes) as any);

    const out = trans.addSignature(pubKey, sig);

    const outBytes = out.toBytes();
  
    res.status(200).json({ result:outBytes })
  }
  
  export default handler;
  