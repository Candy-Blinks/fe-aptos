import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

export type CreateTransactionArguments = {
  collectionName: string;
  collectionDescription: string;
  collectionURI: string;
};

export const createCollection = (args: CreateTransactionArguments): InputTransactionData => {
  const { collectionName, collectionDescription, collectionURI } = args;
  return {
    data: {
      function: `0xcfd592fdf4625e97e375f1ca82201405b3d9474d1b55e77675438ed3beb72407::create_collection::create_collection`,
      functionArguments: [collectionName, collectionDescription, collectionURI],
    },
  };
};
