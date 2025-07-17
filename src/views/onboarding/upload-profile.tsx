"use client";
import { Button } from "@/components/ui/button";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useStore } from "@/store/store";
import { API_URL, ASSETS_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  IUploadProfileSchema,
  UploadProfileSchema,
} from "@/lib/schemas/onboarding.schema";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function UploadProfile() {
  const { setOnboardingPageNumber, onboardingPageNumber } = useStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (file: File) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) handleImageChange(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const form = useForm<IUploadProfileSchema>({
    resolver: zodResolver(UploadProfileSchema),
    defaultValues: {
      profilePictureUrl: "",
    },
  });

  useEffect(() => {
    console.log(form?.formState?.isValid);
  }, [form?.formState?.isValid]);

  const {
    mutate: validateProfilePicture,
    data: users,
    isSuccess: validateProfilePictureIsSuccess,
  } = useMutation({
    mutationFn: async ({ profilePictureUrl }: any) => {
      const {
        data: { data },
      } = await axios.get(
        `${API_URL}users/profile-upload/${profilePictureUrl}`
      );
      return data;
    },
  });

  useEffect(() => {
    if (validateProfilePictureIsSuccess && users.length == 0) {
      setOnboardingPageNumber(onboardingPageNumber + 1);
    }
  }, [users, validateProfilePictureIsSuccess]);

  const onContinue = () => {
    validateProfilePicture({
      profilePictureUrl: form.getValues("profilePictureUrl"),
    });
  };

  return (
    <>
      <p className="text-[39px] font-semibold text-center uppercase text-white-100">
        Create your Profile
      </p>

      <div className="flex flex-col gap-2">
        <Form {...form}>
          <FormField
            control={form.control}
            name="profilePictureUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={cn("text-[20px] pt-6 text-center text-pink-50")}
                >
                  Add profile pic
                </FormLabel>
                <FormControl className="flex w-full items-center justify-center">
                  <div
                    onClick={handleImageClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={cn(
                      "relative flex cursor-pointer min-w-[608px] flex-col items-center justify-center rounded-md",
                      {
                        "w-[300px] h-[300px] bg-transparent": selectedImage,
                        "w-full h-[238px] bg-white-100": !selectedImage,
                      }
                    )}
                  >
                    {!selectedImage ? (
                      <>
                        <Image
                          width={109}
                          height={109}
                          src={ASSETS_URL + "/icons/image-upload-01.svg"}
                          className="size-[109] relative aspect-square object-cover"
                          alt="upload profile picture"
                        />
                        <p className="text-[20px] font-semibold pt-6 text-center text-black-100">
                          Click here or Drag and Drop your Image
                        </p>
                      </>
                    ) : (
                      <div className="size-[300px]">

                      <Image
                        width={300}
                        height={300}
                        src={selectedImage}
                        alt="Profile preview"
                        className="aspect-square size-[300px] w-full rounded-md object-cover"
                        />
                        </div>
                    )}
                    <Input
                      {...field}
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      value={field.value}
                    />
                    <div className="pt-2 border-b-pink-50 border-b-2" />
                  </div>
                </FormControl>
                <FormDescription
                  className={cn("text-[20px] text-left mt-2 text-pink-50 pt-1")}
                >
                  You can always change your picture!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>

      </div>
      <Button
        // onClick={() => handleContinue(3)}
        disabled={!selectedImage}
        onClick={() => {
          setOnboardingPageNumber(onboardingPageNumber + 1);
        }}
        className={cn(
          "text-[20px] uppercase font-semibold h-[60px] w-full text-white-100 hover:bg-pink-80 border border-pink-50",
          {
            "bg-pink-50": selectedImage,
            "bg-pink-100": !selectedImage,
          }
        )}
      >
        Continue
      </Button>
    </>
  );
}
