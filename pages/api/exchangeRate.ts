


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Client,PrivateKey,ContractExecuteTransaction,Hbar, ContractId,ContractCallQuery
   } from "@hashgraph/sdk";
   import type { NextApiRequest, NextApiResponse } from 'next';
   
   type Data = {
     result?: string
     error?: string
   }
   
   const handler = async (
     req: NextApiRequest,
     res: NextApiResponse<Data>
   ) => {
       const stakingContractId= ContractId.fromString("30826342");
     const rewardsContractId= ContractId.fromString("30826343");
 
     const client = Client.forTestnet();
     client.setOperator(process.env.OPERATOR_ID as string, process.env.OPERATOR_KEY as string);
  
     const defaultGas = 300_000;
 
     let responseObject = {};
    
 
     const contractQuery = new ContractCallQuery()
     .setContractId(stakingContractId)
     .setGas(defaultGas)
     .setFunction("getExchangeRate");
 
     try{

         const contractCallResult = await contractQuery.execute(client);
         const message = contractCallResult.getInt256();
         console.log("contract message: " + message);
         responseObject = {result:`${message.toString()}`}
     }
     catch (err: any) {
         responseObject = {
             error: err.message as String
         }
     }
   
     res.status(200).json(responseObject)
   }
   
   export default handler;
   
 