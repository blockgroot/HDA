


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    ContractExecuteTransaction, PrivateKey, Transaction
} from "@hashgraph/sdk";
import type { NextApiRequest, NextApiResponse } from 'next';

interface results{
  balance:string
  isAssciated:boolean
}
type Data = {
  result?: results
  error?:string
}

type NextApiRequest = typeof NextApiRequest
type NextApiResponse = typeof NextApiResponse




const handler = async (
  req:NextApiRequest,
  res:NextApiResponse
) => {
  try {

      
   const transBytes = new Uint8Array(Object.values(req.body.transactionBytes));
   console.log("trans bytes",transBytes);
    const privKey = PrivateKey.fromString("302e020100300506032b657004220420071f6190c647388e0b8ffac5ec13fc17d81b267ce36d10c1f9b4cf0ed9921ad3");
    const pubKey = privKey.publicKey;

    // let nodeId = [new AccountId(3)];
    // let transId = TransactionId.generate(signingAcctId)
    let trans:Transaction = ContractExecuteTransaction.fromBytes(transBytes)

    
    trans =  trans.freeze();

    let tb = trans.toBytes();

    const sig =  privKey.signTransaction(Transaction.fromBytes(tb) as any);

    const out = trans.addSignature(pubKey, sig);

    const outBytes = out.toBytes();
    
    console.log("Transaction bytes", outBytes);


    res.status(200).json({result:outBytes})
  }
  catch (err:any){

    console.log(err)
    res.status(500).json({ error:err.message })
  }
 
}

export default handler;




