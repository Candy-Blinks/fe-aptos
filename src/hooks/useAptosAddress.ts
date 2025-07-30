import { useState, useEffect } from 'react';
import { cookieUtils } from '@/lib/cookies';

export function useAptosAddress() {
  const [aptosAddress, setAptosAddress] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get address from cookie
    const address = cookieUtils.getAptosAddress();
    setAptosAddress(address);
    setIsLoading(false);
  }, []);

  const updateAptosAddress = (address: string) => {
    cookieUtils.setAptosAddress(address);
    setAptosAddress(address);
  };

  const clearAptosAddress = () => {
    cookieUtils.removeAptosAddress();
    setAptosAddress(undefined);
  };

  return {
    aptosAddress,
    isLoading,
    updateAptosAddress,
    clearAptosAddress,
    isConnected: !!aptosAddress,
  };
} 