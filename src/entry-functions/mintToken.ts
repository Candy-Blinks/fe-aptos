import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/lib/constants";

export type MintTokenTransactionArguments = {
  collectionOwner: string;
  collectionName: string;
  tokenName: string;
  tokenURI: string;
  tokenDesc: string;
};

export const mintToken = (args: MintTokenTransactionArguments): InputTransactionData => {
  const { collectionOwner, collectionName, tokenName, tokenURI, tokenDesc } = args;
  return {
    data: {
      function: `0xf1666ac83e1cadb75d448c61427f7dcd49cbd6a9d48de8cbf384d93d72187662::nft_collection::mint_token`,
      functionArguments: [collectionOwner, collectionName, tokenName, tokenURI, tokenDesc],
    },
  };
};
