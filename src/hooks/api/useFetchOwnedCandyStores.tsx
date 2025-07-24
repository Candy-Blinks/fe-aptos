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
      if (!accountAddress) {
        throw new Error("No account address provided");
      }

      try {
        const { data } = await axios.get(
          `${API_URL}/api/collections/owned-collections?owner=${accountAddress}`,
          {
            headers: {
              'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          }
        );

        if (!data || data.length === 0) {
          throw new Error("No collections found.");
        }

        setHubCandyStore(accountAddress);
        
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status === 403) {
            throw new Error("Forbidden: Access denied");
          }
          if (error.response?.status === 429) {
            throw new Error("Too many requests: Please try again later");
          }
        }
        throw error;
      }
    },
    enabled: !!accountAddress,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    ...query,
  };
}