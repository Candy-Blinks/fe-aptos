import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface IUseRegisterUser {
  username: string;
  aptos_address: string;
  profile_url?: string;
  referral_code?: string;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useRegisterUser() {
  const mutation = useMutation({
    mutationKey: ["registerUser"],
    mutationFn: async ({ username, aptos_address, profile_url, referral_code }: IUseRegisterUser) => {
      if (!username) {
        throw new Error("No username provided");
      }

      if (!aptos_address) {
        throw new Error("No Aptos address provided");
      }

      try {
        // Proceed with registration - backend handles validation
        const { data } = await axios.post(
          joinUrl(API_URL, '/api/users/register'),
          {
            username,
            aptos_address,
            display_name: username,
            profile_url,
            referral_code,
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

        if (!data?.username) {
          throw new Error("Invalid user data: missing username");
        }

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle specific HTTP status codes
          if (error.response?.status === 400) {
            throw new Error("Bad request: Invalid user data");
          }
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status === 409) {
            // Backend ConflictException - extract the actual message
            const message = error.response?.data?.message || "Username or Aptos address already exists";
            throw new Error(message);
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
        error.message.includes("already registered") ||
        error.message.includes("already taken") ||
        error.message.includes("Username is already taken") ||
        error.message.includes("Aptos address is already registered") ||
        error.message.includes("Both username and aptos address are already registered")
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