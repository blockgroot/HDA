//https://github.com/Anchor-Protocol/anchor-web-app/blob/8842e8839701bb73d3178500ee7878d0f09cd3b0/packages/src/%40terra-dev/wallet-types/errors.ts#L67
export function toUserReadableError(errorCode: any) {
  const errorMapping = {
    UserDenied: "User Denied",
    CreateTxFailed: "Failed to create transaction. Please try again.",
    TxFailed: "Transaction failed to go through. Please verify and try again.",
    Timeout: "Failed to get a user input. Please retry.",
    TxUnspecifiedError: "Failure - Please retry.",
    InsufficientUST: "Not enough UST for transaction fee",
  };
  for (var key in errorMapping) {
    if (errorCode.includes(key)) {
      let objectKey = key as keyof typeof errorMapping;
      return errorMapping[objectKey];
    }
  }
  return errorMapping.TxUnspecifiedError;
}

// export const ERROR_TOOLTIPS = {
//     CONNECT_WALLET: "Please connect wallet",
//     INSUFFICIENT_REWARDS: "Not enough rewards to cliam",
//     INSUFFICIENT_AIRDROPS: "No airdrops to claim",
//     INSUFFICIENT_DEPOSITS: "Not enough deposits to undelegate",
//     EXISTING_UNDELEGATE_ORDER:
//         "You cannot undelegate because a current undelegation order for this pool is pending",
//   const errorMapping = {
//     UserDeniedError: "User Denied",
//     CreateTxFailed: "Failed to create transaction. Please try again.",
//     TxFailed: "Transaction failed to go through. Please verify and try again.",
//     Timeout: "Failed to get a user input. Please retry.",
//     TxUnspecifiedError: "Failure - Please retry.",
//     InsufficientUST: "Not enough UST for transaction fee",
//   };
//   for (var key in errorMapping) {
//     if (errorCode.includes(key)) {
//       let objectKey = key as keyof typeof errorMapping;
//       return errorMapping[objectKey];
//     }
//   }
//   return errorMapping.TxUnspecifiedError;
// }

export const ERROR_TOOLTIPS = {
  CONNECT_WALLET: "Please connect wallet",
  INSUFFICIENT_REWARDS: "Not enough rewards to cliam",
  INSUFFICIENT_AIRDROPS: "No airdrops to claim",
  INSUFFICIENT_DEPOSITS: "Not enough deposits to undelegate",
  EXISTING_UNDELEGATE_ORDER:
    "You cannot undelegate because a current undelegation order for this pool is pending",
};
