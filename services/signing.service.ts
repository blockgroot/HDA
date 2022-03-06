
import {
    Client,
    PrivateKey,
    HbarUnit,
    TransferTransaction,
    Transaction,
    AccountId,
    Hbar,
    TransactionId
} from "@hashgraph/sdk"
import { builtinModules } from "module";




export async function init() {
    const client = Client.forTestnet();
    client.setOperator("0.0.29670565", "302e020100300506032b657004220420071f6190c647388e0b8ffac5ec13fc17d81b267ce36d10c1f9b4cf0ed9921ad3");
    return client
}

export async function signAndMakeBytes(trans: Transaction, signingAcctId: string) {
    
    const privKey = PrivateKey.fromString("302e020100300506032b657004220420071f6190c647388e0b8ffac5ec13fc17d81b267ce36d10c1f9b4cf0ed9921ad3");
    const pubKey = privKey.publicKey;

    let nodeId = [new AccountId(3)];
    let transId = TransactionId.generate(signingAcctId)
    
    trans.setNodeAccountIds(nodeId);
    trans.setTransactionId(transId);
    
    trans =  trans.freeze();

    let transBytes = trans.toBytes();

    const sig =  privKey.signTransaction(Transaction.fromBytes(transBytes) as any);

    const out = trans.addSignature(pubKey, sig);

    const outBytes = out.toBytes();
    
    console.log("Transaction bytes", outBytes);

    return outBytes;
}

export async function makeBytes(trans: Transaction, signingAcctId: string) {
    
    let transId = TransactionId.generate(signingAcctId)
    trans.setTransactionId(transId);
    trans.setNodeAccountIds([new AccountId(3)]);

    trans.freeze();
    
    let transBytes = trans.toBytes();

    return transBytes;
}


