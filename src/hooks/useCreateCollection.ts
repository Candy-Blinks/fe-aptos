import { useMutation } from "@tanstack/react-query";
import { createCollection } from "@/entry-functions/createCollection";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import axios from "axios";
import { PINATA_GATEWAY } from "@/lib/constants";

interface ICreateCollectionArgs {
  collectionName: string;
  collectionDescription: string;
  collectionURI: string;
  maxSupply: number;
  symbol: string;
  jsonManifestId: string;
}

export default function useCreateCollection() {
  const { signAndSubmitTransaction } = useWallet();

  const mutation = useMutation({
    mutationFn: async ({
      collectionName,
      collectionDescription,
      collectionURI,
      maxSupply,
      symbol,
      jsonManifestId,
    }: ICreateCollectionArgs) => {
      // Fetch the first token's metadata to get example token info
      // (assuming tokens are numbered sequentially starting from 1)
      const { data: firstTokenMetadata } = await axios.get(`${PINATA_GATEWAY}ipfs/${jsonManifestId}/1.json`);

      // Create collection transaction with all required fields
      const committedTransaction = await signAndSubmitTransaction(
        createCollection({
          collectionName: collectionName,
          collectionDescription: collectionDescription,
          collectionURI: collectionURI,
          maxSupply: maxSupply,
          tokenName: symbol,
          tokenDescription: firstTokenMetadata.description || collectionDescription,
          tokenUri: `${PINATA_GATEWAY}ipfs/${jsonManifestId}/`,
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
