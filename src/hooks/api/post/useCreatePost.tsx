import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { PostWithRelations } from "./types";

interface CreatePostParams {
  aptos_address: string;
  content: string;
  files?: File[];
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useCreatePost() {
  const mutation = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async ({ aptos_address, content, files }: CreatePostParams): Promise<PostWithRelations> => {
      if (!aptos_address) {
        throw new Error("No Aptos address provided");
      }

      if (!content) {
        throw new Error("No content provided");
      }

      try {
        // Create FormData for multipart/form-data
        const formData = new FormData();
        formData.append('aptos_address', aptos_address);
        formData.append('content', content);

        // Add files if provided (max 4 files as per backend)
        if (files && files.length > 0) {
          if (files.length > 4) {
            throw new Error("Maximum 4 files allowed");
          }
          files.forEach((file) => {
            formData.append('files', file);
          });
        }

        const { data } = await axios.post(
          joinUrl(API_URL, '/api/posts'),
          formData,
          {
            headers: {
              'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
              // Don't set Content-Type - let axios set it with boundary for multipart
            },
            timeout: 30000, // 30 second timeout for file uploads
          }
        );

        if (!data) {
          throw new Error("No response data received");
        }

        if (!data?.id) {
          throw new Error("Invalid post data: missing id");
        }

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle specific HTTP status codes
          if (error.response?.status === 400) {
            throw new Error("Bad request: Invalid post data");
          }
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status === 404) {
            throw new Error("User not found");
          }
          if (error.response?.status === 413) {
            throw new Error("File too large");
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
        error.message.includes("User not found") ||
        error.message.includes("File too large") ||
        error.message.includes("Maximum 4 files")
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