import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UploadSingleFileResponse {
  success: boolean;
  url: string;
  message: string;
}

interface UseUploadSingleFileProps {
  file: File;
  folder?: string;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useUploadSingleFile() {
  return useMutation({
    mutationKey: ["uploadSingleFile"],
    mutationFn: async ({ file, folder = 'general' }: UseUploadSingleFileProps): Promise<UploadSingleFileResponse> => {
      if (!file) {
        throw new Error("No file provided");
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      try {
        const { data } = await axios.post(
          joinUrl(API_URL, '/api/files/upload-single'),
          formData,
          {
            params: {
              folder,
            },
            headers: {
              'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
              'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // 30 second timeout for file uploads
          }
        );

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle specific HTTP status codes
          if (error.response?.status === 400) {
            const message = error.response?.data?.message || "Bad request: Invalid file";
            throw new Error(message);
          }
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status === 413) {
            throw new Error("File too large: Maximum size is 10MB");
          }
          if (error.response?.status === 415) {
            throw new Error("Unsupported file type: Only images are allowed");
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
        error.message.includes("Unauthorized") ||
        error.message.includes("File too large") ||
        error.message.includes("Unsupported file type")
      ) {
        return false;
      }
      return failureCount < 2; // Only retry server errors twice
    },
  });
} 