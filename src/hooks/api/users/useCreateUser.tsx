import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// User interface based on your schema
interface User {
  id: string;
  username: string;
  aptos_address: string;
  display_name: string;
  email?: string;
  header_url?: string;
  profile_url?: string;
  bio?: string;
  activity_points: number;
  role: string;
  is_new_user: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  socials: {
    x?: string;
    tiktok?: string;
    website?: string;
    youtube?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
  referral_code: string;
  referral_count: number;
  referred_by?: string;
}

interface CreateUserParams {
  username: string;
  aptos_address: string;
  display_name: string;
  email?: string;
  header_url?: string;
  profile_url?: string;
  bio?: string;
  referral_code?: string;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useCreateUser() {
  const mutation = useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (userData: CreateUserParams): Promise<User> => {
      if (!userData.username) {
        throw new Error("Username is required");
      }

      if (!userData.aptos_address) {
        throw new Error("Aptos address is required");
      }

      if (!userData.display_name) {
        throw new Error("Display name is required");
      }

      try {
        const { data } = await axios.post(
          joinUrl(API_URL, '/api/users'),
          userData,
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
          throw new Error("Invalid user data: missing id");
        }

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle specific HTTP status codes
          if (error.response?.status === 400) {
            const message = error.response?.data?.message || "Bad request: Invalid user data";
            throw new Error(message);
          }
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status === 409) {
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
        error.message.includes("already exists") ||
        error.message.includes("Username is required") ||
        error.message.includes("Aptos address is required") ||
        error.message.includes("Display name is required")
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