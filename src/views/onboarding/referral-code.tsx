"use client";
import { Button } from "@/components/ui/button";
import React from "react";
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
// import { API_URL } from "@/lib/constants";
import { ReferralCodeSchema, IReferralCodeSchema } from "@/lib/schemas/onboarding.schema";

export default function ReferralCode() {
  const {
    setOnboardingPageNumber,
    onboardingPageNumber,
    referralCodeValidated,
    // setReferralCodeValidated,
    setOnboardingPayload,
    onboardingPayload,
  } = useStore();

  const form = useForm<IReferralCodeSchema>({
    resolver: zodResolver(ReferralCodeSchema),
    defaultValues: {
      referralCode: undefined,
    },
  });

  // const {
  //   mutate: validateReferralCode,
  //   data: users,
  //   isSuccess: validateReferralCodeIsSuccess,
  // } = useMutation({
  //   mutationFn: async ({ referralCode }: any) => {
  //     try {
  //       const {
  //         data: { data },
  //       } = await axios.get(`${API_URL}users/referralCode/${referralCode}`);
  //       setReferralCodeValidated(true);

  //       return data;
  //     } catch (e) {
  //       setReferralCodeValidated(false);

  //       return null;
  //     }
  //   },
  // });

  const onValidateReferralCode = () => {
    // validateReferralCode({ referralCode: form.getValues("referralCode") });
  };

  const onContinue = () => {
    setOnboardingPayload({
      ...onboardingPayload,
      referralCode: form?.getValues("referralCode"),
    });
    setOnboardingPageNumber(onboardingPageNumber + 1);
  };

  return (
    <>
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
                    />

                    {referralCodeValidated ? (
                      <Button
                        // className={"title h-[30px] rounded-[8px] bg-white-100 text-black-100 hover:bg-white-80"}
                        className="title h-[30px] rounded-[8px] bg-white-100 text-black-100 hover:bg-white-80"
                      >
                        Successful
                      </Button>
                    ) : (
                      <Button
                        onClick={onValidateReferralCode}
                        disabled={!field.value}
                        className={cn(
                          "text-[20px] h-[30px] rounded-[8px]  hover:bg-white-80",
                          {
                            "border border-white-50 text-white-50 bg-transparent":
                              !field.value,
                            "bg-white-100 text-black-100": field.value,
                          }
                        )}
                      >
                        Submit
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
        disabled={!referralCodeValidated}
        // disabled={!isReferralValid}
        className={cn(
          "text-[20px] uppercase font-semibold h-[82px] w-full  text-white-100 hover:bg-pink-80 border border-pink-50",
          {
            "bg-pink-50": !referralCodeValidated,
            "bg-pink-100": referralCodeValidated,
          }
        )}
      >
        Continue
      </Button>
      <Button
        //! temporary func
        onClick={() => {
          setOnboardingPageNumber(onboardingPageNumber + 1);
        }}
        className={cn(
          "text-[20px] uppercase font-semibold h-[82px] w-full  text-white-100 hover:bg-pink-80 bg-pink-50 border border-pink-50"
        )}
      >
        Skip
      </Button>
    </>
  );
}
