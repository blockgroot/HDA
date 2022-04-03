import { ButtonOutlined } from "@atoms/Button/Button";
import useHashConnect from "@hooks/useHashConnect";
import React, { useState } from "react";
import MainLayout from "../layout";

interface signedTransactionParams {
  publicKey: string;
  signature: string;
}

function Sign() {
  const [transaction, setTranasaction] = useState("");
  const [signedTransaction, setSignedTransaction] =
    useState<signedTransactionParams | null>(null);
  const { signTransaction, status } = useHashConnect();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    getSignedTransaction();
  };

  const getSignedTransaction = async () => {
    const trans = await signTransaction(transaction);
    setSignedTransaction(trans);
    // setSignedTransaction(signTransaction(transaction));
  };
  //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  //   }

  if (status === "WALLET_NOT_CONNECTED") {
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
              htmlFor="signTranasactionTextArea"
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
              id="signTranasactionTextArea"
              rows={3}
              placeholder="Your Transaction"
              onChange={(e) => setTranasaction(e.target.value)}
              value={transaction}
            ></textarea>
            {/* <div className="flex space-x-2 justify-center">
              <button
                onClick={handleClick}
                type="button"
                className="inline-block m-6 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Sign transaction
              </button>
            </div> */}
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
              {JSON.stringify(signedTransaction)}
            </div>
          )}
        </div>
      </MainLayout>
    </div>
  );
}

export default Sign;
