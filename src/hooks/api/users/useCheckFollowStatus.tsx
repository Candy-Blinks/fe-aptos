import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface CheckFollowStatusParams {
  follower_aptos_address: string; // The user who might be following
  following_aptos_address: string; // The user who might be followed
}

interface FollowStatusResponse {
  isFollowing: boolean;
  follow_id?: string; // ID of the follow relationship if it exists
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useCheckFollowStatus({ follower_aptos_address, following_aptos_address }: CheckFollowStatusParams) {
  const query = useQuery({
    queryKey: ["followStatus", follower_aptos_address, following_aptos_address],
    queryFn: async (): Promise<FollowStatusResponse> => {
      if (!follower_aptos_address) {
        throw new Error("Follower aptos address is required");
      }

      if (!following_aptos_address) {
        throw new Error("Following aptos address is required");
      }

      // Return false if trying to check if someone follows themselves
      if (follower_aptos_address === following_aptos_address) {
        return { isFollowing: false };
      }

      try {
        const { data } = await axios.get(
          joinUrl(API_URL, '/api/users/follow-status'),
          {
            params: {
              follower_aptos_address,
              following_aptos_address,
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

        if (typeof data.isFollowing !== 'boolean') {
          throw new Error("Invalid follow status response");
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
            // User not found or no follow relationship - return false
            return { isFollowing: false };
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
    enabled: !!follower_aptos_address && !!following_aptos_address,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes('Unauthorized') || 
          error.message.includes('Forbidden') ||
          error.message.includes('aptos address is required')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    ...query,
  };
} 