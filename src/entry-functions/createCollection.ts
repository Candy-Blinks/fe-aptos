import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

export type CreateTransactionArguments = {
  collectionName: string;
  collectionDescription: string;
  collectionURI: string;
  maxSupply: number;
  tokenName: string;
  tokenDescription: string;
  tokenUri :string;
};

export const createCollection = (args: CreateTransactionArguments): InputTransactionData => {
  const { collectionName, collectionDescription, collectionURI, maxSupply, tokenName, tokenDescription, tokenUri } = args;
  return {
    data: {
      function: `0xf1666ac83e1cadb75d448c61427f7dcd49cbd6a9d48de8cbf384d93d72187662::nft_collection::create_collection`,
      functionArguments: [collectionName, collectionDescription, collectionURI, maxSupply, tokenName, tokenDescription, tokenUri],
    },
  };
};
