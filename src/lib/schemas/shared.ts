import { APTOS_ADDRESS_REGEX } from "../regex";
import { z } from "zod";

export const validAptosAddress = z
  .string()
  .regex(APTOS_ADDRESS_REGEX, "Must be a valid aptos address");
