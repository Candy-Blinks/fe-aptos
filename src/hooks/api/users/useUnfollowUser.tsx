import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UnfollowUserParams {
  follower_aptos_address: string; // The user who is unfollowing
  following_aptos_address: string; // The user being unfollowed
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useUnfollowUser() {
  const mutation = useMutation({
    mutationKey: ["unfollowUser"],
    mutationFn: async ({ follower_aptos_address, following_aptos_address }: UnfollowUserParams) => {
      if (!follower_aptos_address) {
        throw new Error("Follower aptos address is required");
      }

      if (!following_aptos_address) {
        throw new Error("Following aptos address is required");
      }

      if (follower_aptos_address === following_aptos_address) {
        throw new Error("You cannot unfollow yourself");
      }

      try {
        const { data } = await axios.delete(
          joinUrl(API_URL, '/api/users/unfollow'),
          {
            data: {
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

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle specific HTTP status codes
          if (error.response?.status === 400) {
            const message = error.response?.data?.message || "Bad request: Invalid unfollow data";
            throw new Error(message);
          }
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status === 404) {
            throw new Error("Follow relationship not found");
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
    retry: (failureCount, error) => {
      // Don't retry on specific errors
      if (
        error.message.includes("Bad request") ||
        error.message.includes("Unauthorized") ||
        error.message.includes("not found") ||
        error.message.includes("cannot unfollow yourself") ||
        error.message.includes("aptos address is required")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    ...mutation,
  };
} 