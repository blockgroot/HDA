import { NATIVE_TOKEN_MULTIPLIER, precision } from "@constants/constants";

export function nativeTokenFormatter(amount: number) {
  let formattedAmount = parseFloat(
    (amount / NATIVE_TOKEN_MULTIPLIER).toString()
  ).toFixed(precision);

  return parseFloat(formattedAmount);
}

// export function nativeTokenFormatterOrion(amount: number) {
//   let formattedAmount = parseFloat((amount / 100000000).toString()).toFixed(8);

//   return parseFloat(formattedAmount);
// }

export function formatAmount(value: number, min: number = 1e3): string {
  // Alter numbers larger than 1k
  if (value >= min) {
    var units = ["k", "M", "B", "T"];

    // Divide to get SI Unit engineering style numbers (1e3,1e6,1e9, etc)
    const unit = Math.floor((value.toFixed(0).length - 1) / 3) * 3;
    // Calculate the remainder
    // @ts-ignore
    const num = (value / ("1e" + unit)).toFixed(2);
    const unitname = units[Math.floor(unit / 3) - 1];

    // output number remainder + unitname
    return `${num} ${unitname}`;
  }

  // return formatted original number
  return value.toLocaleString();
}
