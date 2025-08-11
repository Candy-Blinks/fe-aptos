import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UpdatePostParams {
  postId: string;
  aptos_address: string;
  content?: string;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useUpdatePost() {
  const mutation = useMutation({
    mutationKey: ["updatePost"],
    mutationFn: async ({ postId, aptos_address, content }: UpdatePostParams) => {
      if (!postId) {
        throw new Error("No post ID provided");
      }

      if (!aptos_address) {
        throw new Error("No Aptos address provided");
      }

      try {
        const { data } = await axios.patch(
          joinUrl(API_URL, `/api/posts/${postId}`),
          {
            aptos_address,
            content,
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

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle specific HTTP status codes
          if (error.response?.status === 400) {
            throw new Error("Bad request: Invalid post data");
          }
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: You can only update your own posts");
          }
          if (error.response?.status === 403) {
            throw new Error("Forbidden: Access denied");
          }
          if (error.response?.status === 404) {
            throw new Error("Post not found");
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
        error.message.includes("not found")
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