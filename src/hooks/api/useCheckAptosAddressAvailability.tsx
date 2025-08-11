import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface CheckAptosAddressResponse {
  available: boolean;
  message: string;
}

interface UseCheckAptosAddressAvailabilityProps {
  aptosAddress: string;
  enabled?: boolean;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function useCheckAptosAddressAvailability({
  aptosAddress,
  enabled = true,
}: UseCheckAptosAddressAvailabilityProps) {
  return useQuery({
    queryKey: ["checkAptosAddressAvailability", aptosAddress],
    queryFn: async (): Promise<CheckAptosAddressResponse> => {
      if (!aptosAddress) {
        throw new Error("Aptos address is required");
      }

      const { data } = await axios.get(joinUrl(API_URL, '/api/users/check-aptos-address'), {
        params: {
          aptos_address: aptosAddress,
        },
        headers: {
          'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
        },
        timeout: 5000,
      });

      return data;
    },
    enabled: enabled && !!aptosAddress && aptosAddress.length > 0,
    retry: false,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
} 