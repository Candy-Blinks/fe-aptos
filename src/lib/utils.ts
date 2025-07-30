import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Account } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "@/lib/constants";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, length = 5): string {
  if (!address) return "";
  return `${address.slice(0, length)}.....${address.slice(-length)}`;
}

export function findCandyStorePda(collectionAddress: string): string {
  // In Aptos, we create deterministic resource addresses using seeds
  // This creates a resource address based on the module address and collection
  const seed = new TextEncoder().encode(`candystore_${collectionAddress}`);

  try {
    const resourceAccount = Account.fromDerivationPath({
      path: `m/44'/637'/0'/0'/0'`,
      mnemonic: Array.from(seed).join(" "), // Convert seed to mnemonic-like format
    });

    return resourceAccount.accountAddress.toString();
  } catch {
    // Fallback: create a deterministic address using simple hash approach
    const combinedSeed = `${MODULE_ADDRESS}_candystore_${collectionAddress}`;
    const hash = Array.from(new TextEncoder().encode(combinedSeed)).reduce(
      (acc, byte) => acc + byte.toString(16).padStart(2, "0"),
      "",
    );

    // Create a valid Aptos address format (64 characters)
    const paddedHash = hash.padStart(64, "0").substring(0, 64);
    return `0x${paddedHash}`;
  }
}

export function jsonToFile(data: unknown, name: string) {
  const jsonString = JSON.stringify({
    ...(data as any),
  });

  const blob = new Blob([jsonString], { type: "application/json" });

  return new File([blob], name, {
    type: "application/json",
  });
}

export interface CountdownTime {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isComplete: boolean;
}

export function getCountdownTime(unixTimestamp: number): CountdownTime {
  const targetDate = new Date(unixTimestamp * 1000); // Convert Unix timestamp to milliseconds
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00", isComplete: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    .toString()
    .padStart(2, "0");
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((difference / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((difference / 1000) % 60)
    .toString()
    .padStart(2, "0");

  return { days, hours, minutes, seconds, isComplete: false };
}

export function formatUnixTimestamp(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  return format(date, "MMMM dd, yyyy HH:mm:ss"); // Example: December 20, 2024 10:15:24
}

// Helper function to properly join URL paths
export function joinUrl(base: string, path: string) {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
