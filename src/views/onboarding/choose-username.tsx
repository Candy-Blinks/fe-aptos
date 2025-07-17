"use client";
import { Button } from "@/components/ui/button";
import {
  ChooseUsernameSchema,
  IChooseUsernameSchema,
} from "@/lib/schemas/onboarding.schema";
import React, { useEffect } from "react";
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
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
import { useStore } from "@/store/store";

export default function ChooseUsername() {
  const {
    setOnboardingPageNumber,
    onboardingPageNumber,
    // setOnboardingPayload,
    // onboardingPayload,
  } = useStore();

  const form = useForm<IChooseUsernameSchema>({
    resolver: zodResolver(ChooseUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    console.log(form?.formState?.isValid);
  }, [form?.formState?.isValid]);

  //! action for username is here
  // const {
  //   mutate: validateUsername,
  //   data: users,
  //   isSuccess: validateUsernameIsSuccess,
  // } = useMutation({
  //   mutationFn: async ({ username }: any) => {
  //     const {
  //       data: { data },
  //     } = await axios.get(`${API_URL}users/username/${username}`);
  //     return data;
  //   },
  // });

  // useEffect(() => {
  //   if (validateUsernameIsSuccess && users.length == 0) {
  //     setOnboardingPayload({
  //       ...onboardingPayload,
  //       username: form?.getValues("username"),
  //     });
  //     setOnboardingPageNumber(onboardingPageNumber + 1);
  //   }
  // }, [users, validateUsernameIsSuccess, form?.getValues("username")]);

  // const onContinue = () => {
  //   validateUsername({ username: form.getValues("username") });
  // };

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
                    className="bg-transparent text-white-100 "
                    {...field}
                  />
                  <div className="pt-2 border-b-pink-50 border-b-2" />
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
        disabled={!form?.formState?.isValid}
        //! temporary onclick func
        onClick={() => {
          setOnboardingPageNumber(onboardingPageNumber + 1);
        }}
        // onClick={onContinue}
        className={cn(
          "text-[20px] uppercase font-semibold h-[82px] w-full bg-pink-50 text-white-100 hover:bg-pink-80 border border-pink-50"
        )}
      >
        Continue
      </Button>
    </>
  );
}
