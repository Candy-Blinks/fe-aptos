import { useMutation } from "@tanstack/react-query";
import { mintToken } from "@/entry-functions/mintToken";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";

interface IMintTokenArgs {
  collectionOwner: string;
  collectionName: string;
  tokenName: string;
  tokenDescription: string;
  tokenURI: string;
}

export default function useMintToken() {
  const { signAndSubmitTransaction } = useWallet();

  const mutation = useMutation({
    mutationFn: async ({
      collectionOwner,
      collectionName,
      tokenName,
      tokenDescription,
      tokenURI,

    }: IMintTokenArgs) => {


      // Mint token transaction
      const committedTransaction = await signAndSubmitTransaction(
        mintToken({
          // minter: minter,
          collectionOwner: collectionOwner,
          collectionName: collectionName,
          tokenName: tokenName,
          tokenDesc: tokenDescription,
          tokenURI: tokenURI,
        }),
      );

      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      return {
        mintTransactionHash: executedTransaction.hash,
      };
    },
  });

  return { ...mutation };
}