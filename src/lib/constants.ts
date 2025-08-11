import type { Network } from "@aptos-labs/wallet-adapter-react";
// import { PinataSDK } from "pinata-web3";

export const NETWORK: Network = (process.env.NEXT_PUBLIC_APP_NETWORK as Network) ?? "testnet";
// export const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS;
export const APTOS_API_KEY = process.env.NEXT_PUBLIC_APTOS_API_KEY;

export const ASSETS_URL = "https://raw.githubusercontent.com/Candy-Blinks/assets/refs/heads/main/";

// export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
// export const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT ?? "TEST";
// export const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY ?? "https://gateway.pinit.io/";

// export const PINATA = new PinataSDK({
//   pinataJwt: PINATA_JWT,
//   pinataGateway: PINATA_GATEWAY,
// });