import { useAptosAddress } from './useAptosAddress';
import { useUserAuthStore } from '@/store/user-auth.store';
import useFetchUserByAptosAddress from '@/hooks/api/users/useFetchUserByAptosAddress';
import { useEffect } from 'react';

export function useWalletUser() {
  const { aptosAddress, isConnected } = useAptosAddress();
  const { user, loginUser, logoutUser, isLoggedIn } = useUserAuthStore();
  
  // Fetch user data when wallet is connected
  const { data: fetchedUser, isLoading: isLoadingUser } = useFetchUserByAptosAddress(
    aptosAddress || ""
  );

  // Auto-login user when wallet is connected and user data is fetched
  useEffect(() => {
    if (aptosAddress && fetchedUser && !isLoggedIn) {
      loginUser({
        id: fetchedUser.id,
        username: fetchedUser.username,
        aptos_address: fetchedUser.aptos_address,
        profile_url: fetchedUser.profile_url,
        display_name: fetchedUser.display_name,
        referral_code: fetchedUser.referral_code,
        points: fetchedUser.activity_points,
        created_at: fetchedUser.created_at,
      });
    }
  }, [aptosAddress, fetchedUser, isLoggedIn, loginUser]);

  // Auto-logout when wallet is disconnected
  useEffect(() => {
    if (!isConnected && isLoggedIn) {
      logoutUser();
    }
  }, [isConnected, isLoggedIn, logoutUser]);

  return {
    aptosAddress,
    isConnected,
    user: isLoggedIn ? user : null,
    isLoadingUser,
    isAuthenticated: isConnected && isLoggedIn,
  };
} 