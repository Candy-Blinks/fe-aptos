import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { joinUrl } from "@/lib/utils";

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
  referral_code: string;
  referral_count: number;
  referred_by?: string;
}

interface UseFetchUserByAptosAddressProps {
  aptos_address: string;
}

interface UseFetchUserByAptosAddressReturn {
  data: User | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export default function useFetchUserByAptosAddress(
  aptos_address: string
): UseFetchUserByAptosAddressReturn {
  const queryKey = ["user", aptos_address];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async (): Promise<User> => {
      if (!aptos_address) {
        throw new Error("Aptos address is required");
      }

      const response = await axios.get(joinUrl(API_URL, `/api/users`), {
        params: { aptos_address },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      return response.data;
    },
    enabled: !!aptos_address && aptos_address.length > 0,
    retry: (failureCount, error) => {
      // Don't retry on 404 (user not found) or 400 (bad request)
      if (error.message.includes("404") || error.message.includes("400")) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
} 