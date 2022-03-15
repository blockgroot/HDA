


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  AccountInfoQuery, Client
} from "@hashgraph/sdk";
import type { NextApiRequest, NextApiResponse } from 'next';
import Error from "next/error";
import { hethers } from '@hashgraph/hethers';

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
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const accountId = req.query.accountId as string;
    // const tokenId = req.query.tokenId as string;
    // const client = Client.forNetwork(process.env.NETWORK);
    // client.setOperator(process.env.OPERATOR_ID as string, process.env.OPERATOR_KEY as string);
  
    // const query = new AccountInfoQuery().setAccountId(accountId);
    // const accountInfo = await query.execute(client);
  
    // const isAssciated = accountInfo.tokenRelationships._map.has(tokenId)
  
    // // console.log("The hbar account balance for this account is " +accountInfo.balance.toTinybars().toString());
  
    // const resultObject = {balance:accountInfo.balance.toTinybars().toString(),isAssciated}

    const provider = hethers.providers.getDefaultProvider('testnet');

    const balance =  (await provider.getBalance(accountId)).toNumber();
    



    res.status(200).json({result:balance})
  }
  catch (err:any){

    console.log(err)
    res.status(500).json({ error:err.message })
  }
 
}

export default handler;




//v2.0.7