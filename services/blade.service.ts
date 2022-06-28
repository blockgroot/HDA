import { BladeSigner } from "@bladelabs/blade-web3.js";
import { AccountId, ContractExecuteTransaction } from "@hashgraph/sdk";
import { config } from "config/config";
import { MessageTypes } from "hashconnect";
import { errors } from "constants/index";

export class BladeService {
  private accountId: AccountId | undefined;
  private signer: BladeSigner | undefined = undefined;
  private isSessionCreated: boolean = false;
  public isExtensionInstalled: boolean = false;
  private checkCount = 0;

  setSigner() {
    this.signer = new BladeSigner();
  }

  getWalletData(): MessageTypes.ApprovePairing {
    if (!this.signer) {
      throw new Error(errors.BLADEWALLLET_SIGNER_NOT_INIT);
    }

    //TODO: result is null. needs to be fixed
    const network = config.network.name;
    const accountIds = [this.signer.getAccountId().toString()];
    return {
      network,
      accountIds,
      metadata: {
        name: `Blade Wallet (${network})`,
        description: "Blade Wallet",
        icon: "",
      },
      topic: "",
    };
  }

  async checkExtensionInstalled() {
    this.checkCount++;

    if (!Boolean((window as any).bladeConnect)) {
      return new Promise(async (resolve) => {
        if (this.checkCount > 10) {
          resolve(false);
        } else {
          setTimeout(async () => {
            resolve(this.checkExtensionInstalled());
          }, 500);
        }
      });
    }
    this.isExtensionInstalled = true;
    return Promise.resolve(true);
  }

  async loadWallet(): Promise<AccountId> {
    if (!this.signer) {
      throw new Error(errors.BLADEWALLLET_SIGNER_NOT_INIT);
    }
    try {
      /// Blade Signer is now ready for use.
      if (!this.isSessionCreated) {
        /// Create session with WalletExtension.
        await this.signer.createSession(config.network.bladeWallet);
        this.isSessionCreated = true;
      }

      this.accountId = this.signer.getAccountId();
      return this.accountId;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getBalance() {
    if (!this.signer) {
      throw new Error(errors.BLADEWALLLET_SIGNER_NOT_INIT);
    }
    return this.signer.getAccountBalance();
  }

  async sendTransaction(transaction: ContractExecuteTransaction) {
    if (!this.signer) {
      throw new Error(errors.BLADEWALLLET_SIGNER_NOT_INIT);
    }
    if (!this.accountId) {
      throw new Error("Account must be set");
    }

    return await this.signer.sendRequest(transaction);
  }
}