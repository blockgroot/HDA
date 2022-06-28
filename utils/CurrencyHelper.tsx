import {
  fiatPrecision,
  NATIVE_TOKEN_MULTIPLIER,
  precision,
} from "@constants/constants";
import BigNumber from "bignumber.js";

const getPrecisionMul = (precision: number) => {
  let val = 1;
  for (let index = 0; index < precision; index++) {
    val = val * 0.1;
  }
  return val.toPrecision(precision);
};

// export function nativeTokenFormatter(amount: number) {
//   let amount_fixed_precision = amount / NATIVE_TOKEN_MULTIPLIER;
//   const precision_mul: string = getPrecisionMul(precision);
//   amount_fixed_precision = amount_fixed_precision - Number(precision_mul);
//   const formattedAmount = parseFloat(amount_fixed_precision.toString()).toFixed(
//     precision
//   );
//   return parseFloat(formattedAmount);
// }

export function convertTokenToUsd(amount: number, usdRate: number) {
  const formattedAmount = (
    (amount / NATIVE_TOKEN_MULTIPLIER) *
    usdRate
  ).toFixed(fiatPrecision);

  return parseFloat(formattedAmount);
}

// export function nativeTokenFormatter(amount: number) {
//   let formattedAmount = parseFloat(
//     (amount / NATIVE_TOKEN_MULTIPLIER).toString()
//   ).toFixed(precision);

//   return parseFloat(formattedAmount);
// }

export function nativeTokenFormatter(amount: number) {
  const bigNumAmount = new BigNumber(amount);
  const formattedAmount = bigNumAmount
    .dividedBy(new BigNumber(NATIVE_TOKEN_MULTIPLIER))
    .toFixed(precision, 3);
  return parseFloat(formattedAmount);
}

export function formatWIthLocale(amount: number) {
  return amount.toLocaleString(undefined, {
    maximumFractionDigits: precision,
    // maximumSignificantDigits: 9,
  });
}

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
