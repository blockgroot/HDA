


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Client,PrivateKey,ContractExecuteTransaction,Hbar, ContractId,ContractCallQuery
   } from "@hashgraph/sdk";
   import type { NextApiRequest, NextApiResponse } from 'next';
   import { hethers,providers } from '@hashgraph/hethers';
   
   
   type Data = {
     result?: string
     error?: string
   }
   
   const handler = async (
     req: NextApiRequest,
     res: NextApiResponse<Data>
   ) => {
    //    const stakingContractId= ContractId.fromString("0.0.30899851");
 
    //  const client = Client.forTestnet();
    //  client.setOperator(process.env.OPERATOR_ID as string, process.env.OPERATOR_KEY as string);
  
    //  const defaultGas = 300_000;
 
    //  let responseObject = {};
    
 
    //  const contractQuery = new ContractCallQuery()
    //  .setContractId(stakingContractId)
    //  .setGas(defaultGas)
    //  .setFunction("getExchangeRate");

    const abi =[
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_hbarxAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_hbarxTreasuryAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_multisigAdminAddress",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "Fallback",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "Paused",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "Received",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "int64",
            "name": "",
            "type": "int64"
          }
        ],
        "name": "Staked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "Unpaused",
        "type": "event"
      },
      {
        "stateMutability": "payable",
        "type": "fallback"
      },
      {
        "inputs": [],
        "name": "getExchangeRate",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "maxDeposit",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "minDeposit",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "paused",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "rewardsContractAddress",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_hbarxTreasuryAddress",
            "type": "address"
          }
        ],
        "name": "setHbarxTreasuryAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_maxHbarxSupply",
            "type": "uint256"
          }
        ],
        "name": "setMaxHbarxSupply",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_multisigAdminAddress",
            "type": "address"
          }
        ],
        "name": "setMultisigAdminAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_rewardsContractAddress",
            "type": "address"
          }
        ],
        "name": "setRewardsContractAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "stake",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_newMaxDeposit",
            "type": "uint256"
          }
        ],
        "name": "updateMaxDeposit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_newMinDeposit",
            "type": "uint256"
          }
        ],
        "name": "updateMinDeposit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address payable",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "stateMutability": "payable",
        "type": "receive"
      }
    ]

    const provider = hethers.providers.getDefaultProvider('testnet')

    const address = "0000000000000000000000000000000001d77e8b";

    const privateKey = '302e020100300506032b657004220420071f6190c647388e0b8ffac5ec13fc17d81b267ce36d10c1f9b4cf0ed9921ad3';

    const wallet = new hethers.Wallet(privateKey);


    // const connectedSigner = wallet.connect(provider);



    const stakingContractId= new hethers.Contract(address, abi, wallet);


 
     try{

         const contractCallResult = await contractQuery.execute(client);

         console.log(JSON.stringify(contractCallResult))
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
   
 