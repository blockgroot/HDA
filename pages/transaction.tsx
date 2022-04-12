import { ButtonOutlined } from "@atoms/Button/Button";
import useHashConnect from "@hooks/useHashConnect";
import React, { useState } from "react";
import MainLayout from "../layout";

function Sign() {
  const [transaction, setTransaction] = useState("");
  const [signedTransaction, setSignedTransaction] = useState<string | null>(
    null
  );
  const { signTransaction, status } = useHashConnect();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSignedTransaction("");
    getSignedTransaction();
  };

  const getSignedTransaction = async () => {
    const trans = await signTransaction(transaction);
    setSignedTransaction(trans);
  };

  if (status !== "WALLET_CONNECTED") {
    return (
      <div>
        <MainLayout></MainLayout>
      </div>
    );
  }
  return (
    <div>
      <MainLayout>
        <div className="flex justify-center flex-col">
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
              placeholder="Your Transaction"
              onChange={(e) => setTransaction(e.target.value)}
              value={transaction}
            ></textarea>
            <div className="mt-4 lg:mt-8 flex justify-center">
              <ButtonOutlined
                type="button"
                onClick={handleClick}
                disabled={transaction == ""}
              >
                Sign Transaction
              </ButtonOutlined>
            </div>
          </div>
          {signedTransaction && (
            <div className="mt-4 lg:mt-8 break-words justify-center text-center text-white w-full">
              {signedTransaction}
            </div>
          )}
        </div>
      </MainLayout>
    </div>
  );
}

export default Sign;
