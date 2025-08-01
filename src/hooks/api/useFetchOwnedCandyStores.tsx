import { API_URL } from "@/lib/constants";
import { useStore } from "@/store/store";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";

interface IUseFetchOwnedCandyStores {
  accountAddress?: string;
}

export default function useFetchOwnedCandyStores({ accountAddress }: IUseFetchOwnedCandyStores) {
  const { setHubCandyStore, setHubCollection } = useStore();

  const query = useQuery({
    queryKey: ["collections", accountAddress],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}api/collections/owned-collections?owner=${accountAddress}`);

      if (!data || data.length === 0) {
        throw new Error("No collections found.");
      }

      if (!accountAddress) {
        throw Error("No Candy Store Address");
      }

      // if (!response?.collection) {
      //   throw Error("No Collection address");
      // }

      setHubCandyStore(accountAddress);
      // setHubCollection(response?.collection);

      return data;
    },
    enabled: !!accountAddress,
  });

  return {
    ...query,
  };
}
