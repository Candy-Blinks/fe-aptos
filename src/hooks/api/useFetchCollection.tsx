import { API_URL } from "@/lib/constants";
import { useStore } from "@/store/store";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";

interface IUseFetchCollection {
  collectionOwner: string;
  collectionName: string;
}

export default function useFetchCollection({ collectionOwner, collectionName }: IUseFetchCollection) {
  // const { setHubCandyStore, setHubCollection } = useStore();

  const query = useQuery({
    queryKey: ["collection", collectionOwner, collectionName],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}api/collections/collection?owner=${collectionOwner}&name=${collectionName}`,
      );

      if (!data) {
        throw Error("No response");
      }

      if (!collectionOwner) {
        throw Error("No Collection Owner");
      }

      if (!data?.collection_name) {
        throw Error("No Collection name");
      }

      // setHubCandyStore(candyStoreAddress);
      // setHubCollection(response?.collection);

      return data;
    },
    enabled: !!collectionOwner && !!collectionName,
  });

  return {
    ...query,
  };
}
