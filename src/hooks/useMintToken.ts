import { useMutation } from "@tanstack/react-query";
import { mintToken } from "@/entry-functions/mintToken";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";

interface IMintTokenArgs {
  collectionName: string;
  tokenName: string;
  tokenDescription: string;
  tokenURI: string;
}

export default function useMintToken() {
  const { signAndSubmitTransaction } = useWallet();

  const mutation = useMutation({
    mutationFn: async ({
      collectionName,
      tokenName,
      tokenDescription,
      tokenURI,

    }: IMintTokenArgs) => {


      // Mint token transaction
      const committedTransaction = await signAndSubmitTransaction(
        mintToken({
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