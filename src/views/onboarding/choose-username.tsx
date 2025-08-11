"use client";
import { Button } from "@/components/ui/button";
import {
  ChooseUsernameSchema,
  IChooseUsernameSchema,
} from "@/lib/schemas/onboarding.schema";
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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { toast } from "sonner";

interface CheckUsernameResponse {
  available: boolean;
  message: string;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function ChooseUsername() {
  const {
    setOnboardingPageNumber,
    onboardingPageNumber,
    setOnboardingPayload,
    onboardingPayload,
  } = useStore();

  const [isUsernameValidated, setIsUsernameValidated] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    type: "success" | "error" | "checking";
    message: string;
  } | null>(null);

  const form = useForm<IChooseUsernameSchema>({
    resolver: zodResolver(ChooseUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const watchedUsername = form.watch("username");

  // Manual username check mutation (triggered on Enter or button click)
  const { mutate: checkUsername, isPending: isCheckingUsername } = useMutation({
    mutationKey: ["checkUsername"],
    mutationFn: async (username: string): Promise<CheckUsernameResponse> => {
      const { data } = await axios.get(joinUrl(API_URL, '/api/users/check-username'), {
        params: { username },
        headers: {
          'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
        },
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.available) {
        setIsUsernameValidated(true);
        setUsernameStatus({
          type: "success",
          message: "Username is available!"
        });
        // Update onboarding payload with validated username
        setOnboardingPayload({
          ...onboardingPayload,
          username: watchedUsername,
        });
      } else {
        setIsUsernameValidated(false);
        setUsernameStatus({
          type: "error",
          message: "Username is already taken"
        });
      }
    },
    onError: (error) => {
      console.error("Error checking username:", error);
      setIsUsernameValidated(false);
      setUsernameStatus({
        type: "error",
        message: "Error checking username"
      });
      toast.error("Failed to check username availability. Please try again.");
    }
  });

  useEffect(() => {
    console.log(form?.formState?.isValid);
  }, [form?.formState?.isValid]);

  // Reset validation when username changes
  useEffect(() => {
    if (watchedUsername !== onboardingPayload.username) {
      setIsUsernameValidated(false);
      setUsernameStatus(null);
    }
  }, [watchedUsername, onboardingPayload.username]);

  // Handle Enter key press to check username
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && watchedUsername && watchedUsername.length >= 3 && form.formState.isValid && !isUsernameValidated) {
      e.preventDefault();
      handleCheckUsername();
    }
  };

  // Handle username checking logic
  const handleCheckUsername = () => {
    if (!watchedUsername || watchedUsername.length < 3 || !form.formState.isValid) {
      return;
    }
    
    setUsernameStatus({
      type: "checking",
      message: "Checking availability..."
    });
    checkUsername(watchedUsername);
  };

  // Handle continue to next step
  const handleContinue = () => {
    if (!isUsernameValidated) {
      toast.error("Please check username availability first.");
      return;
    }

    // Username is validated, proceed to next step
    setOnboardingPageNumber(onboardingPageNumber + 1);
  };

  // Handle main button click (either check or continue)
  const handleMainButtonClick = () => {
    if (isUsernameValidated) {
      handleContinue();
    } else {
      handleCheckUsername();
    }
  };

  // Determine button state and text
  const getButtonState = () => {
    if (isCheckingUsername) {
      return {
        text: "Checking...",
        disabled: true,
        variant: "checking"
      };
    }
    
    if (isUsernameValidated) {
      return {
        text: "Continue",
        disabled: false,
        variant: "continue"
      };
    }
    
    if (watchedUsername && watchedUsername.length >= 3 && form.formState.isValid) {
      return {
        text: "Check Availability",
        disabled: false,
        variant: "check"
      };
    }
    
    return {
      text: "Check Availability",
      disabled: true,
      variant: "disabled"
    };
  };

  const buttonState = getButtonState();

  return (
    <>
      <p className="text-[39px] font-semibold text-center uppercase text-white-100">
        Create your Profile
      </p>
      <Form {...form}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn("font-semibold text-pink-50")}>
                Username
              </FormLabel>
              <FormControl>
                <div className="flex flex-col">
                  <Input
                    placeholder="Name"
                    className="bg-transparent text-white-100"
                    {...field}
                    onKeyPress={handleKeyPress}
                  />
                  <div className="pt-2 border-b-pink-50 border-b-2" />
                  
                  {/* Username availability status */}
                  {usernameStatus && (
                    <div className="mt-2">
                      <p className={cn("text-sm", {
                        "text-green-400": usernameStatus.type === "success",
                        "text-red-400": usernameStatus.type === "error",
                        "text-yellow-400": usernameStatus.type === "checking",
                      })}>
                        {usernameStatus.message}
                      </p>
                    </div>
                  )}
                  
                  {/* Help text */}
                  {watchedUsername && watchedUsername.length >= 3 && form.formState.isValid && !usernameStatus && (
                    <div className="mt-2">
                      <p className="text-sm text-blue-400">
                        Press Enter or click the button to check availability
                      </p>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className={cn("text-sm text-pink-50 pt-1")}>
                You can always change your name!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <Button
        disabled={buttonState.disabled}
        onClick={handleMainButtonClick}
        className={cn(
          "text-[20px] uppercase font-semibold h-[82px] w-full text-white-100 hover:bg-pink-80 border border-pink-50",
          {
            "bg-pink-50": buttonState.variant === "disabled" || buttonState.variant === "checking" || buttonState.variant === "check",
            "bg-pink-100": buttonState.variant === "continue",
          }
        )}
      >
        {buttonState.text}
      </Button>
    </>
  );
}
