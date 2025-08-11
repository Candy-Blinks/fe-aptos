import Cookies from 'js-cookie';

const APTOS_ADDRESS_COOKIE = 'aptos_address';
const APTOS_ADDRESS_EXPIRY_DAYS = 30; // 30 days

export const cookieUtils = {
  // Store the user's Aptos address in a cookie
  setAptosAddress: (address: string) => {
    Cookies.set(APTOS_ADDRESS_COOKIE, address, { 
      expires: APTOS_ADDRESS_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  // Get the user's Aptos address from cookie
  getAptosAddress: (): string | undefined => {
    return Cookies.get(APTOS_ADDRESS_COOKIE);
  },

  // Remove the Aptos address cookie (for logout)
  removeAptosAddress: () => {
    Cookies.remove(APTOS_ADDRESS_COOKIE);
  },

  // Check if user has a stored Aptos address
  hasAptosAddress: (): boolean => {
    return !!Cookies.get(APTOS_ADDRESS_COOKIE);
  }
}; 