import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface ExtractPublicIdResponse {
  success: boolean;
  publicId: string;
  url: string;
}

interface UseExtractPublicIdProps {
  url: string;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useExtractPublicId() {
  return useMutation({
    mutationKey: ["extractPublicId"],
    mutationFn: async ({ url }: UseExtractPublicIdProps): Promise<ExtractPublicIdResponse> => {
      if (!url) {
        throw new Error("URL is required");
      }

      try {
        const { data } = await axios.post(
          joinUrl(API_URL, '/api/files/extract-public-id'),
          {},
          {
            params: {
              url,
            },
            headers: {
              'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
            },
            timeout: 5000, // 5 second timeout
          }
        );

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle specific HTTP status codes
          if (error.response?.status === 400) {
            const message = error.response?.data?.message || "Bad request: Invalid URL";
            throw new Error(message);
          }
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status && error.response.status >= 500) {
            throw new Error("Server error: Please try again later");
          }
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (
        error.message.includes("Bad request") ||
        error.message.includes("Unauthorized")
      ) {
        return false;
      }
      return failureCount < 2; // Only retry server errors twice
    },
  });
} 