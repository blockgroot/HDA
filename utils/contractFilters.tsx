import { ContractAddressType } from "@types_/common";

export const getContractByName = (
  contracts: any,
  contractName: string
): ContractAddressType => {
  return contracts.find(
    (contract: any) =>
      contract.name.toLowerCase() === contractName.toLowerCase()
  );
};

export const getValidatorByAddress = (
  validators: any,
  validatorAddress: string
) => {
  const validator = validators.validators.find(
    (validator: any) => validator.operatorAddress === validatorAddress
  );
  return validator;
};
