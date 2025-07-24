import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface CheckAvailabilityResponse {
  exists: boolean;
  usernameExists: boolean;
  aptosAddressExists: boolean;
}

interface UseCheckAvailabilityProps {
  username: string;
  aptosAddress: string;
  enabled?: boolean;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useCheckAvailability({
  username,
  aptosAddress,
  enabled = true,
}: UseCheckAvailabilityProps) {
  return useQuery({
    queryKey: ["checkAvailability", username, aptosAddress],
    queryFn: async (): Promise<CheckAvailabilityResponse> => {
      if (!username) {
        throw new Error("Username is required");
      }

      if (!aptosAddress) {
        throw new Error("Aptos address is required");
      }

      const { data } = await axios.get(joinUrl(API_URL, '/api/users/check-availability'), {
        params: {
          username,
          aptos_address: aptosAddress,
        },
        headers: {
          'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
        },
        timeout: 5000,
      });

      return data;
    },
    enabled: enabled && !!username && !!aptosAddress && username.length > 0 && aptosAddress.length > 0,
    retry: false,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
} 