import { ConnectedWallet, TxResult } from "@terra-dev/use-wallet";
import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  UserDenied,
} from "@terra-dev/wallet-types/errors";
import {
  Coins,
  LCDClient,
  Msg,
  MsgExecuteContract,
  StdFee,
} from "@terra-money/terra.js";
import { config } from "../../../../config/config";

type AnyObject = { [key: string]: unknown };
const terraClient = new LCDClient({
  URL: config.network.fcd,
  chainID: config.network.chainID,
});

const GAS_FEE_MULTIPLIER_UUSD = 0.15;
const UUSD = "uusd";
class StaderContract<Q extends AnyObject, E extends AnyObject> {
  private contractAddress: string;
  private wallet: ConnectedWallet;

  constructor(contractAddress: string, wallet: ConnectedWallet) {
    this.contractAddress = contractAddress;
    this.wallet = wallet;
  }

  private getWalletAddress() {
    return this.wallet.terraAddress;
  }

  async execute(
    executeMsg: E,
    coins?: Coins.Input
  ): Promise<Either<ErrorMsg, TxResult>> {
    const msg = new MsgExecuteContract(
      this.getWalletAddress(), // sender
      this.contractAddress, // contract address
      executeMsg, // handle msgs
      coins
    );

    try {
      const { gas } = await this.estimateFee(msg);
      const fee = Math.ceil(gas * GAS_FEE_MULTIPLIER_UUSD);

      const result = await this.wallet.post({
        fee: new StdFee(gas, `${fee}${UUSD}`),
        msgs: [msg],
      });

      return { right: result };
    } catch (error) {
      console.log({ error });
      let errorMsg = "Something went wrong";
      if (error instanceof UserDenied) {
        errorMsg = "User denied the transaction";
      } else if (error instanceof CreateTxFailed) {
        errorMsg =
          "Failed to create transaction ( Did not create txhash - error not broadcasted )";
      } else if (error instanceof TxFailed) {
        errorMsg =
          "Failed to execute transaction ( Created txhash - error broadcasted )";
      } else if (error instanceof Timeout) {
        errorMsg = "User did not act anything in specific time";
      } else if (error && typeof error === "object" && "response" in error) {
        errorMsg = extractErrorMsg(error) || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      } else if (error && typeof error === "string") {
        errorMsg = error;
      }
      return { left: { errorMsg } };
    }
  }

  private async estimateFee(msg: Msg) {
    return terraClient.tx.estimateFee(this.getWalletAddress(), [msg]);
  }

  async query<Response>(query: Q): Promise<Response> {
    return terraClient.wasm.contractQuery(this.contractAddress, query);
  }
}

export default StaderContract;

function extractErrorMsg(error: unknown) {
  const msg: string = (error as any)?.response?.data?.error;
  if (msg) {
    const splits = msg.split(":");
    const mainMsg = splits[splits.length - 3];
    const subMsg = splits[splits.length - 2];
    if (mainMsg || subMsg) {
      return [mainMsg, subMsg].filter(Boolean).join(" - ");
    } else {
      return msg;
    }
  }
  return null;
}

// Either Start
type Left<T> = {
  left: T;
  right?: never;
};

type Right<U> = {
  left?: never;
  right: U;
};

type Either<T, U> = NonNullable<Left<T> | Right<U>>;
// Either End

type ErrorMsg = { errorMsg: string };
