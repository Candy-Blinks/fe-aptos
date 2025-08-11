import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
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

interface FetchAllUsersParams {
  take?: number;
  skip?: number;
  search?: string; // Optional search parameter
  role?: string; // Optional role filter
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useFetchAllUsers({ take = 20, skip = 0, search, role }: FetchAllUsersParams = {}) {
  const query = useQuery({
    queryKey: ["allUsers", take, skip, search, role],
    queryFn: async (): Promise<User[]> => {
      try {
        const params: Record<string, any> = {
          take,
          skip,
        };

        // Add optional parameters if provided
        if (search) {
          params.search = search;
        }
        if (role) {
          params.role = role;
        }

        const { data } = await axios.get(
          joinUrl(API_URL, '/api/users/all'),
          {
            params,
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

        // Ensure data is an array
        if (!Array.isArray(data)) {
          throw new Error("Invalid users data: expected array");
        }

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Invalid API key");
          }
          if (error.response?.status === 403) {
            throw new Error("Forbidden: Access denied");
          }
          if (error.response?.status === 404) {
            throw new Error("Users endpoint not found");
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
      // Don't retry on auth errors or not found
      if (error.message.includes('Unauthorized') || 
          error.message.includes('Forbidden') ||
          error.message.includes('not found')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    ...query,
  };
} 