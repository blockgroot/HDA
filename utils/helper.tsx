export const sortWithdrawDate = (
  array: Array<any>,
  sortOptionFn: (obj: any) => any
): Array<any> => {
  const distantFuture = new Date(8640000000000000);

  return array.sort((first: any, second: any) => {
    let firstDate = sortOptionFn(first)
      ? new Date(sortOptionFn(first) / 1000000000)
      : distantFuture;
    let secondDate = sortOptionFn(second)
      ? new Date(sortOptionFn(second) / 1000000000)
      : distantFuture;
    return firstDate.getTime() - secondDate.getTime();
  });
};

export const stringBalanceToNumber = (value: string) =>
  parseInt(value.replace(",", ""));
