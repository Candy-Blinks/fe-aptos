import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface CheckUsernameResponse {
  available: boolean;
  message: string;
}

interface UseCheckUsernameAvailabilityProps {
  username: string;
  enabled?: boolean;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useCheckUsernameAvailability({
  username,
  enabled = true,
}: UseCheckUsernameAvailabilityProps) {
  return useQuery({
    queryKey: ["checkUsernameAvailability", username],
    queryFn: async (): Promise<CheckUsernameResponse> => {
      if (!username) {
        throw new Error("Username is required");
      }

      const { data } = await axios.get(joinUrl(API_URL, '/api/users/check-username'), {
        params: {
          username,
        },
        headers: {
          'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
        },
        timeout: 5000,
      });

      return data;
    },
    enabled: enabled && !!username && username.length > 0,
    retry: false,
    // Add a small delay to prevent too many API calls while typing
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
} 