import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface CheckReferralCodeResponse {
  exists: boolean;
  message: string;
  referralCode?: string;
}

interface UseCheckReferralCodeProps {
  referralCode: string;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useCheckReferralCode() {
  return useMutation({
    mutationKey: ["checkReferralCode"],
    mutationFn: async ({ referralCode }: UseCheckReferralCodeProps): Promise<CheckReferralCodeResponse> => {
      if (!referralCode) {
        throw new Error("Referral code is required");
      }

      try {
        const { data } = await axios.get(joinUrl(API_URL, '/api/users/check-referral-code'), {
          params: {
            referral_code: referralCode,
          },
          headers: {
            'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
          },
          timeout: 5000,
        });

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle specific HTTP status codes
          if (error.response?.status === 400) {
            throw new Error("Invalid referral code format");
          }
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status === 404) {
            throw new Error("Referral code not found");
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
        error.message.includes("Invalid referral code") ||
        error.message.includes("Unauthorized") ||
        error.message.includes("Referral code not found")
      ) {
        return false;
      }
      return failureCount < 2; // Only retry server errors twice
    },
  });
} 