import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { PostWithRelations } from "./types";

interface SharePostParams {
  originalPostId: string;
  aptos_address: string;
  content?: string; // Optional comment when sharing
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useSharePost() {
  const mutation = useMutation({
    mutationKey: ["sharePost"],
    mutationFn: async ({ originalPostId, aptos_address, content }: SharePostParams): Promise<PostWithRelations> => {
      if (!originalPostId) {
        throw new Error("No original post ID provided");
      }

      if (!aptos_address) {
        throw new Error("No Aptos address provided");
      }

      try {
        const { data } = await axios.post(
          joinUrl(API_URL, `/api/posts/${originalPostId}/share`),
          {
            aptos_address,
            content, // Optional comment when sharing
          },
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

        if (!data?.id) {
          throw new Error("Invalid shared post data: missing id");
        }

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle specific HTTP status codes
          if (error.response?.status === 400) {
            throw new Error("Bad request: Invalid share data");
          }
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status === 403) {
            throw new Error("Forbidden: Access denied");
          }
          if (error.response?.status === 404) {
            throw new Error("User or original post not found");
          }
          if (error.response?.status === 409) {
            throw new Error("Post already shared");
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
        error.message.includes("Forbidden") ||
        error.message.includes("not found") ||
        error.message.includes("already shared")
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