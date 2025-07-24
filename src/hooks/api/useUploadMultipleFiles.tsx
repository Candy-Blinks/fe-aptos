import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UploadMultipleFilesResponse {
  success: boolean;
  urls: string[];
  count: number;
  message: string;
}

interface UseUploadMultipleFilesProps {
  files: File[];
  folder?: string;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useUploadMultipleFiles() {
  return useMutation({
    mutationKey: ["uploadMultipleFiles"],
    mutationFn: async ({ files, folder = 'general' }: UseUploadMultipleFilesProps): Promise<UploadMultipleFilesResponse> => {
      if (!files || files.length === 0) {
        throw new Error("No files provided");
      }

      if (files.length > 10) {
        throw new Error("Maximum 10 files allowed");
      }

      // Create FormData for file upload
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      try {
        const { data } = await axios.post(
          joinUrl(API_URL, '/api/files/upload-multiple'),
          formData,
          {
            params: {
              folder,
            },
            headers: {
              'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
              'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // 60 second timeout for multiple file uploads
          }
        );

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle specific HTTP status codes
          if (error.response?.status === 400) {
            const message = error.response?.data?.message || "Bad request: Invalid files";
            throw new Error(message);
          }
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status === 413) {
            throw new Error("File too large: Maximum size is 5MB per file");
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
        error.message.includes("Unsupported file type") ||
        error.message.includes("Maximum 10 files allowed")
      ) {
        return false;
      }
      return failureCount < 2; // Only retry server errors twice
    },
  });
} 