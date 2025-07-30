import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostWithRelations } from "./types";

interface GetFollowingFeedParams {
  aptos_address: string;
  take?: number;
  skip?: number;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useFetchAllFollowingPosts({ aptos_address, take = 20, skip = 0 }: GetFollowingFeedParams) {
  const query = useQuery({
    queryKey: ["followingFeed", aptos_address, take, skip],
    queryFn: async (): Promise<PostWithRelations[]> => {
      if (!aptos_address) {
        throw new Error("No Aptos address provided");
      }

      try {
        const { data } = await axios.get(
          joinUrl(API_URL, '/api/posts/feed/following'),
          {
            params: {
              aptos_address,
              take,
              skip,
            },
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

        // Ensure data is an array
        if (!Array.isArray(data)) {
          throw new Error("Invalid posts data: expected array");
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
            throw new Error("User not found or no posts available");
          }
          if (error.response?.status === 429) {
            throw new Error("Too many requests: Please try again later");
          }
          if (error.response?.status && error.response.status >= 500) {
            throw new Error("Server error: Please try again later");
          }
        }
        throw error;
      }
    },
    enabled: !!aptos_address,
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
