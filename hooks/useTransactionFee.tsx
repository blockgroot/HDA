import { TransactionFeeContext } from "context/TransactionFeeProvider";
import { useContext } from "react";

const useTransactionFee = () => useContext(TransactionFeeContext);

export default useTransactionFee;
