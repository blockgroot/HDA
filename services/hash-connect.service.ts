import { debug } from 'console';
import { SaveData } from 'context/HashConnectProvider';

import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';
export class HashConnectService {




    constructor(public hashConnect: HashConnect) {

    }

    get listeners(): HashConnect {
      return this.hashConnect;
    }


   async initialize(metadata: HashConnectTypes.AppMetadata | HashConnectTypes.WalletMetadata, network: any, debug = false): Promise<SaveData> {
        let saveData: SaveData = {} as SaveData;
        let initData = await this.hashConnect.init(metadata);
        saveData.privateKey = initData.privKey;

        //then connect, storing the new topic for later
        const state = await this.hashConnect.connect();
        saveData.topic = state.topic;
        //generate a pairing string, which you can display and generate a QR code from
        saveData.pairingString = this.hashConnect.generatePairingString(
          state,
          network,
          debug 
        );

        this.hashConnect.findLocalWallets();

        return saveData;
    }


    
  connect(topic: string, data: HashConnectTypes.AppMetadata | undefined) {
    return  this.hashConnect.connect(topic,data);
  }

  init(metadata: HashConnectTypes.AppMetadata, privateKey: string) {
    return  this.hashConnect.init(metadata,privateKey);
  }
  
  connectToLocalWallet(pairingString: string) {
   return this.hashConnect.connectToLocalWallet(pairingString);
  }

  sendTransaction(topic: string, transaction: MessageTypes.Transaction) {
    return this.hashConnect.sendTransaction(topic,transaction);
  }
}