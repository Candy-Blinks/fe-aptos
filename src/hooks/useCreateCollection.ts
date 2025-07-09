import { useMutation } from "@tanstack/react-query";
import { createCollection } from "@/entry-functions/createCollection";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";

interface ICreateCollectionArgs {
  collectionName: string;
  collectionDescription: string;
  collectionURI: string;
}

export default function useCreateCollection() {
  const { signAndSubmitTransaction } = useWallet();

  const mutation = useMutation({
    mutationFn: async ({
      collectionName,
      collectionDescription,
      collectionURI,

    }: ICreateCollectionArgs) => {


      // Create collection transaction
      const committedTransaction = await signAndSubmitTransaction(
        createCollection({
          collectionName: collectionName,
          collectionDescription: collectionDescription,
          collectionURI: collectionURI,
        }),
      );

      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      return {
        collectionTxHash: executedTransaction.hash,
      };
    },
  });

  return { ...mutation };
}