


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    AccountBalanceQuery, Client
  } from "@hashgraph/sdk";
  import type { NextApiRequest, NextApiResponse } from 'next';
  
  type Data = {
    result: string
  }
  
  const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
  ) => {
    const accountId = req.query.accountId as string;
    const client = Client.forTestnet();
    client.setOperator(process.env.OPERATOR_ID as string, process.env.OPERATOR_KEY as string);
        //Create the account balance query
    const query = new AccountBalanceQuery().setAccountId(accountId);
  
    //Submit the query to a Hedera network
    const accountBalance = await query.execute(client);
  
    //Print the balance of hbars
    console.log("The hbar account balance for this account is " +accountBalance.hbars);
  
  
    res.status(200).json({ result:accountBalance.hbars.toTinybars().toString() })
  }
  
  export default handler;
  
  
  
  
  //v2.0.7