"use client";

import { z } from "zod";

export const ChooseUsernameSchema = z.object({
  username: z.string().min(4).max(20),
});

export type IChooseUsernameSchema = z.infer<typeof ChooseUsernameSchema>;

export const ReferralCodeSchema = z.object({
  referralCode: z.string().min(8).max(8).optional(),
});

export type IReferralCodeSchema = z.infer<typeof ReferralCodeSchema>;

export const UploadProfileSchema = z.object({
  profilePictureUrl: z.string().min(4).max(200),
});

export type IUploadProfileSchema = z.infer<typeof UploadProfileSchema>;
