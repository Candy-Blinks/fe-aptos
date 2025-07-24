"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/store";
import { useUserAuthStore } from "@/store/user-auth.store";
import { ReferralCodeSchema, IReferralCodeSchema } from "@/lib/schemas/onboarding.schema";
import useRegisterUser from "@/hooks/api/useRegisterUser";
import useCheckReferralCode from "@/hooks/api/useCheckReferralCode";
import ReferrerHandler from "@/components/referrer-handler";
import { toast } from "sonner";

export default function ReferralCode() {
  const {
    setOnboardingPageNumber,
    onboardingPageNumber,
    setOnboardingPayload,
    onboardingPayload,
  } = useStore();

  const { loginUser } = useUserAuthStore();

  const [isReferralCodeValidated, setIsReferralCodeValidated] = useState(false);
  const [canSkip, setCanSkip] = useState(true);

  const form = useForm<IReferralCodeSchema>({
    resolver: zodResolver(ReferralCodeSchema),
    defaultValues: {
      referralCode: "",
    },
  });

  const watchedReferralCode = form.watch("referralCode");

  // Hook for checking referral code
  const { 
    mutate: checkReferralCode, 
    isPending: isCheckingCode, 
    error: codeError 
  } = useCheckReferralCode();

  // Hook for user registration
  const { 
    mutate: registerUser, 
    isPending: isRegistering, 
    error: registrationError, 
    isSuccess: isRegistrationSuccess,
    data: registrationData
  } = useRegisterUser();

  // Sync form with onboardingPayload.referralCode when it changes (from URL or other sources)
  useEffect(() => {
    if (onboardingPayload.referralCode && form.getValues("referralCode") !== onboardingPayload.referralCode) {
      form.setValue("referralCode", onboardingPayload.referralCode);
    }
  }, [onboardingPayload.referralCode, form]);

  // Handle registration success
  useEffect(() => {
    if (isRegistrationSuccess && registrationData) {
      // Save user as logged in
      loginUser(registrationData);
      
      toast.success("Registration successful! Welcome aboard!");
      setOnboardingPageNumber(onboardingPageNumber + 1);
    }
  }, [isRegistrationSuccess, registrationData, loginUser, setOnboardingPageNumber, onboardingPageNumber]);

  // Handle registration error
  useEffect(() => {
    if (registrationError) {
      toast.error(registrationError.message || "Registration failed. Please try again.");
    }
  }, [registrationError]);

  // Handle referral code check error
  useEffect(() => {
    if (codeError) {
      toast.error("Referral code not found or invalid.");
      setIsReferralCodeValidated(false);
      setCanSkip(true);
    }
  }, [codeError]);

  // Reset validation when referral code changes
  useEffect(() => {
    if (watchedReferralCode !== onboardingPayload.referralCode) {
      setIsReferralCodeValidated(false);
      setCanSkip(true);
    }
  }, [watchedReferralCode, onboardingPayload.referralCode]);

  const onSubmitReferralCode = () => {
    const code = form.getValues("referralCode");
    if (!code || code.trim() === "") {
      toast.error("Please enter a referral code first.");
      return;
    }

    checkReferralCode(
      { referralCode: code },
      {
        onSuccess: (response) => {
          if (response.exists) {
            setIsReferralCodeValidated(true);
            setCanSkip(false);
            toast.success("Referral code verified successfully!");
            
            // Update onboarding payload
            setOnboardingPayload({
              ...onboardingPayload,
              referralCode: code,
            });
          } else {
            setIsReferralCodeValidated(false);
            setCanSkip(true);
            toast.error("Referral code not found.");
          }
        },
        onError: () => {
          setIsReferralCodeValidated(false);
          setCanSkip(true);
        }
      }
    );
  };

  const onContinue = () => {
    if (!isReferralCodeValidated) {
      toast.error("Please verify your referral code first.");
      return;
    }

    // Register user with validated referral code
    const { referralCode, address, username, profilePic } = onboardingPayload;
    
    if (!username || !address) {
      toast.error("Missing required information. Please complete all previous steps.");
      return;
    }

    registerUser({
      username,
      aptos_address: address,
      profile_url: profilePic,
      referral_code: referralCode,
    });
  };

  const onSkip = () => {
    if (!canSkip) {
      toast.error("Cannot skip after verifying a referral code. Please continue with registration.");
      return;
    }

    // Register user without referral code
    const { address, username, profilePic } = onboardingPayload;
    
    if (!username || !address) {
      toast.error("Missing required information. Please complete all previous steps.");
      return;
    }

    registerUser({
      username,
      aptos_address: address,
      profile_url: profilePic,
      referral_code: undefined,
    });
  };

  return (
    <>
      {/* ReferrerHandler handles URL parameter processing automatically */}
      {onboardingPageNumber === 4 && <ReferrerHandler />}

      <p className="text-[39px] font-semibold text-center uppercase text-white-100">
        Use Referral Code
      </p>

      <Form {...form}>
        <FormField
          control={form.control}
          name="referralCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn("text-[20px] text-pink-50")}>
                Code
              </FormLabel>
              <FormControl>
                <div className="flex flex-col">
                  <div className={cn("h-[82px] flex items-center justify-center gap-2")}>
                    <Input
                      placeholder="Paste code here"
                      {...field}
                      className={cn(
                        `text-[20px] w-full cursor-text placeholder:text-[20px] appearance-none border-none  bg-transparent ps-4 p-1 text-white-100 focus:outline-none focus:ring-0`
                      )}
                      disabled={isCheckingCode || isRegistering}
                    />

                    {isReferralCodeValidated ? (
                      <Button
                        className="title h-[30px] rounded-[8px] bg-green-500 text-white hover:bg-green-600"
                        disabled
                      >
                        Verified
                      </Button>
                    ) : (
                      <Button
                        onClick={onSubmitReferralCode}
                        disabled={!field.value || isCheckingCode || isRegistering}
                        className={cn(
                          "text-[20px] h-[30px] rounded-[8px]  hover:bg-white-80",
                          {
                            "border border-white-50 text-white-50 bg-transparent":
                              !field.value || isCheckingCode || isRegistering,
                            "bg-white-100 text-black-100": field.value && !isCheckingCode && !isRegistering,
                          }
                        )}
                      >
                        {isCheckingCode ? "Checking..." : "Submit"}
                      </Button>
                    )}
                  </div>
                  <div className="pt-2 border-b-pink-50 border-b-2" />
                </div>
              </FormControl>
              <FormDescription className={cn("text-[20px] text-pink-50")}>
                Submit a friend code!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <Button
        onClick={onContinue}
        disabled={!isReferralCodeValidated || isRegistering}
        className={cn(
          "text-[20px] uppercase font-semibold h-[82px] w-full  text-white-100 hover:bg-pink-80 border border-pink-50",
          {
            "bg-pink-50": !isReferralCodeValidated || isRegistering,
            "bg-pink-100": isReferralCodeValidated && !isRegistering,
          }
        )}
      >
        {isRegistering ? "Registering..." : "Continue"}
      </Button>

      <Button
        onClick={onSkip}
        disabled={!canSkip || isRegistering}
        className={cn(
          "text-[20px] uppercase font-semibold h-[82px] w-full  text-white-100 hover:bg-pink-80 border border-pink-50",
          {
            "bg-gray-500": !canSkip || isRegistering,
            "bg-pink-50": canSkip && !isRegistering,
          }
        )}
      >
        {isRegistering ? "Registering..." : "Skip"}
      </Button>
    </>
  );
}
