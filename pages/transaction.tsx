import { ButtonOutlined } from "@atoms/Button/Button";
import useHashConnect from "@hooks/useHashConnect";
import { WalletStatus } from "@molecules/WalletSelector/WalletSelector";
import React, { useState } from "react";
import MainLayout from "../layout";

function Sign() {
  const [transaction, setTransaction] = useState("");
  const [signedTransaction, setSignedTransaction] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const { signTransaction, status } = useHashConnect();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setSignedTransaction(null);
    setError(null);
    await getSignedTransaction();
  };

  const getSignedTransaction = async () => {
    if (!transaction.trim()) {
      setError("Please paste a transaction string");
      return;
    }

    setIsSigning(true);
    setError(null);

    try {
      console.log("=== Starting transaction signing ===");
      console.log("Transaction string length:", transaction.length);

      const trans = await signTransaction(transaction);

      console.log("=== Transaction signing result ===");
      console.log("Result:", trans ? "Success" : "Failed/Cancelled");

      if (trans) {
        setSignedTransaction(trans);
      } else {
        // If no error but no result, the wallet might have opened but shown nothing
        setError(
          "Transaction was sent to wallet but no response received. " +
            "If the wallet opened but showed nothing, the transaction format might not be recognized. " +
            "Please check the browser console for details."
        );
      }
    } catch (err: any) {
      console.error("Error signing transaction:", err);
      const errorMsg =
        err.message || "Failed to sign transaction. Please try again.";

      // Provide more helpful error messages
      if (errorMsg.includes("index out of range")) {
        setError(
          "Transaction format error: The transaction appears incomplete or corrupted. " +
            "Please ensure you copied the complete transaction string."
        );
      } else if (
        errorMsg.includes("SimpleCrypto") ||
        errorMsg.includes("SECRET KEY")
      ) {
        setError(
          "HashConnect encryption error: Please disconnect and reconnect your wallet, then try again."
        );
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div>
      <MainLayout>
        <div className="flex justify-center flex-col">
          {status !== WalletStatus.WALLET_CONNECTED && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg">
              <p className="text-white text-center">
                {status === WalletStatus.INITIALIZING
                  ? "Initializing wallet connection..."
                  : "Please connect your wallet to sign transactions."}
              </p>
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
        disabled:opacity-50 disabled:cursor-not-allowed
      "
              id="signTransactionTextArea"
              rows={3}
              placeholder="Your Transaction"
              onChange={(e) => setTransaction(e.target.value)}
              value={transaction}
              disabled={status !== WalletStatus.WALLET_CONNECTED}
            ></textarea>
            <div className="mt-4 lg:mt-8 flex justify-center">
              <ButtonOutlined
                type="button"
                onClick={handleClick}
                disabled={
                  transaction.trim() === "" ||
                  status !== WalletStatus.WALLET_CONNECTED ||
                  isSigning
                }
              >
                {isSigning ? "Signing..." : "Sign Transaction"}
              </ButtonOutlined>
            </div>
          </div>
          {error && (
            <div className="mt-4 lg:mt-8 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-300 text-center">{error}</p>
            </div>
          )}
          {signedTransaction && (
            <div className="mt-4 lg:mt-8 break-words justify-center text-center text-white w-full">
              <p className="mb-2 text-green-400 font-semibold">
                Transaction signed successfully!
              </p>
              <div className="p-4 bg-gray-800 rounded break-all text-sm">
                {signedTransaction}
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </div>
  );
}

export default Sign;
