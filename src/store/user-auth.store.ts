import React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  aptos_address: string;
  profile_url?: string;
  display_name?: string;
  referral_code?: string;
  points?: number;
  created_at?: string;
}

interface UserAuthState {
  user: User | null;
  isLoggedIn: boolean;
  loginTimestamp: number | null;
  
  // Actions
  loginUser: (userData: User) => void;
  logoutUser: () => void;
  checkSessionExpiry: () => boolean;
  updateUser: (userData: Partial<User>) => void;
  clearExpiredSession: () => void;
}

const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

export const useUserAuthStore = create<UserAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      loginTimestamp: null,

      loginUser: (userData: User) => {
        const timestamp = Date.now();
        set({
          user: userData,
          isLoggedIn: true,
          loginTimestamp: timestamp,
        });

        // Set up auto-logout timer
        setTimeout(() => {
          const state = get();
          if (state.isLoggedIn && state.loginTimestamp === timestamp) {
            state.logoutUser();
          }
        }, THREE_DAYS_IN_MS);
      },

      logoutUser: () => {
        set({
          user: null,
          isLoggedIn: false,
          loginTimestamp: null,
        });
      },

      checkSessionExpiry: () => {
        const { loginTimestamp, isLoggedIn } = get();
        
        if (!isLoggedIn || !loginTimestamp) {
          return false;
        }

        const currentTime = Date.now();
        const sessionAge = currentTime - loginTimestamp;
        
        if (sessionAge > THREE_DAYS_IN_MS) {
          // Session expired
          get().logoutUser();
          return false;
        }
        
        return true;
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      clearExpiredSession: () => {
        const isValid = get().checkSessionExpiry();
        if (!isValid) {
          get().logoutUser();
        }
      },
    }),
    {
      name: "user-auth-storage",
      // Custom storage that checks session expiry on load
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check if session is expired when app loads
          state.clearExpiredSession();
        }
      },
    }
  )
);

// Utility function to get current user
export const getCurrentUser = () => {
  const store = useUserAuthStore.getState();
  const isValid = store.checkSessionExpiry();
  return isValid ? store.user : null;
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  const store = useUserAuthStore.getState();
  return store.checkSessionExpiry();
};

// Hook to periodically check session expiry (optional)
export const useSessionChecker = () => {
  const clearExpiredSession = useUserAuthStore(state => state.clearExpiredSession);
  
  React.useEffect(() => {
    // Check session every hour
    const interval = setInterval(() => {
      clearExpiredSession();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [clearExpiredSession]);
}; 