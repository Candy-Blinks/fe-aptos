import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Account } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "@/constants";

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
      mnemonic: Array.from(seed).join(" ") // Convert seed to mnemonic-like format
    });
    
    return resourceAccount.accountAddress.toString();
  } catch {
    // Fallback: create a deterministic address using simple hash approach
    const combinedSeed = `${MODULE_ADDRESS}_candystore_${collectionAddress}`;
    const hash = Array.from(new TextEncoder().encode(combinedSeed))
      .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
    
    // Create a valid Aptos address format (64 characters)
    const paddedHash = hash.padStart(64, '0').substring(0, 64);
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

