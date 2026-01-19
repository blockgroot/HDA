import { ButtonOutlined } from "@atoms/Button/Button";
import { useDAppConnector } from "@hooks/useDAppConnector";
import React, { useState } from "react";
import MainLayout from "../layout";

function Sign() {
  const [transaction, setTransaction] = useState("");
  const [signedTransaction, setSignedTransaction] = useState<string | null>(
    null
  );
  const [isSigning, setIsSigning] = useState(false);
  const { signTransaction, status, connect, accountId, isConnecting, error } =
    useDAppConnector();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setSignedTransaction(null);

    if (status !== "WALLET_CONNECTED") {
      await connect();
      return;
    }

    setIsSigning(true);
    try {
      const trans = await signTransaction(transaction);
      setSignedTransaction(trans);
    } catch (err: any) {
      console.error("Failed to sign transaction:", err);
      // Error is already set in the hook
    } finally {
      setIsSigning(false);
    }
  };

  if (status === "INITIALIZING") {
    return (
      <div>
        <MainLayout>
          <div className="flex justify-center flex-col items-center">
            <div className="text-white mt-8">
              Initializing wallet connector...
            </div>
          </div>
        </MainLayout>
      </div>
    );
  }
  return (
    <div>
      <MainLayout>
        <div className="flex justify-center flex-col">
          {status !== "WALLET_CONNECTED" && (
            <div className="mb-6 text-center">
              <div className="text-white mb-4">
                {status === "WALLET_NOT_CONNECTED"
                  ? "Please connect your wallet to sign transactions"
                  : "Connecting to wallet..."}
              </div>
              <ButtonOutlined
                type="button"
                onClick={connect}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </ButtonOutlined>
            </div>
          )}

          {accountId && (
            <div className="mb-4 text-center text-white">
              Connected: {accountId}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-center">
              {error}
            </div>
          )}

          <div className="mb-3 md:w-full">
            <label
              htmlFor="signTransactionTextArea"
              className="form-label inline-block mb-2 text-white"
            >
              Paste Transaction
            </label>
            <textarea
              className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
              id="signTransactionTextArea"
              rows={3}
              placeholder="Your Transaction (base64 encoded)"
              onChange={(e) => setTransaction(e.target.value)}
              value={transaction}
              disabled={status !== "WALLET_CONNECTED"}
            ></textarea>
            <div className="mt-4 lg:mt-8 flex justify-center">
              <ButtonOutlined
                type="button"
                onClick={handleClick}
                disabled={
                  transaction === "" ||
                  status !== "WALLET_CONNECTED" ||
                  isSigning
                }
              >
                {isSigning
                  ? "Signing..."
                  : status === "WALLET_CONNECTED"
                  ? "Sign Transaction"
                  : "Connect Wallet"}
              </ButtonOutlined>
            </div>
          </div>
          {signedTransaction && (
            <div className="mt-4 lg:mt-8 break-words justify-center text-center text-white w-full p-4 bg-green-500/20 border border-green-500 rounded">
              <div className="mb-2 font-semibold">Signed Transaction:</div>
              <div className="break-all">{signedTransaction}</div>
            </div>
          )}
        </div>
      </MainLayout>
    </div>
  );
}

export default Sign;
