import { API_URL } from "@/lib/constants";
import { useStore } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface IUseFetchCollection {
  collectionOwner: string;
  collectionName: string;
}

export default function useFetchCollection({ collectionOwner, collectionName }: IUseFetchCollection) {
  const query = useQuery({
    queryKey: ["collection", collectionOwner, collectionName],
    queryFn: async () => {
      if (!collectionOwner) {
        throw new Error("No Collection Owner provided");
      }
      
      if (!collectionName) {
        throw new Error("No Collection Name provided");
      }

      try {
        const { data } = await axios.get(
          `${API_URL}api/collections/collection?owner=${collectionOwner}&name=${collectionName}`,
          {
            headers: {
              'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          }
        );

        if (!data) {
          throw new Error("No response data received");
        }

        if (!data?.collection_name) {
          throw new Error("Invalid collection data: missing collection_name");
        }

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status === 403) {
            throw new Error("Forbidden: Access denied");
          }
          if (error.response?.status === 404) {
            throw new Error("Collection not found");
          }
          if (error.response?.status === 429) {
            throw new Error("Too many requests: Please try again later");
          }
        }
        throw error;
      }
    },
    enabled: !!collectionOwner && !!collectionName,
    retry: (failureCount, error) => {
      // Don't retry on auth errors or not found
      if (error.message.includes('Unauthorized') || 
          error.message.includes('Forbidden') ||
          error.message.includes('not found')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    ...query,
  };
}