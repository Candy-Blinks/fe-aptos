import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

export type MintTokenTransactionArguments = {
  collectionName: string;
  tokenName: string;
  tokenURI: string;
  tokenDesc: string;
};

export const mintToken = (args: MintTokenTransactionArguments): InputTransactionData => {
  const { collectionName, tokenName, tokenURI, tokenDesc } = args;
  return {
    data: {
      function: `0xcfd592fdf4625e97e375f1ca82201405b3d9474d1b55e77675438ed3beb72407::create_collection::mint_token`,
      functionArguments: [collectionName, tokenName, tokenURI, tokenDesc],
    },
  };
};
