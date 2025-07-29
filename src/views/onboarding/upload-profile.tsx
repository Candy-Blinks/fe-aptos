"use client";
import { Button } from "@/components/ui/button";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useStore } from "@/store/store";
import { ASSETS_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IUploadProfileSchema, UploadProfileSchema } from "@/lib/schemas/onboarding.schema";
import Image from "next/image";
import useUploadSingleFile from "@/hooks/api/useUploadSingleFile";
import { toast } from "sonner";

export default function UploadProfile() {
  const { setOnboardingPageNumber, onboardingPageNumber, setOnboardingPayload, onboardingPayload } = useStore();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadFile, isPending: isUploading, error: uploadError } = useUploadSingleFile();

  const handleImageChange = (file: File) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
      setIsImageUploaded(false);
      setUploadedUrl(null);

      // Update form value with file name for validation
      form.setValue("profilePictureUrl", file.name);

      // Automatically start upload
      uploadFile(
        { file: file, folder: "profiles" },
        {
          onSuccess: (response) => {
            // Save uploaded URL to state and store
            setUploadedUrl(response.url);
            setIsImageUploaded(true);

            // Update onboarding payload with uploaded URL
            setOnboardingPayload({
              ...onboardingPayload,
              profilePic: response.url,
            });

            toast.success("Profile picture uploaded successfully!");
          },
          onError: (error) => {
            console.error("Upload failed:", error);
            toast.error("Failed to upload profile picture. Please try again.");

            // Reset states on error
            setSelectedImage(null);
            setSelectedFile(null);
            setIsImageUploaded(false);
            setUploadedUrl(null);
            form.setValue("profilePictureUrl", "");
          },
        },
      );
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
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
    // Only allow new selection if not currently uploading
    if (!isUploading) {
      fileInputRef.current?.click();
    }
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

  // Handle upload error
  useEffect(() => {
    if (uploadError) {
      toast.error(uploadError.message || "Failed to upload profile picture.");
    }
  }, [uploadError]);

  const onContinue = () => {
    if (!isImageUploaded || !uploadedUrl) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }

    // Proceed to next step (image already uploaded and saved to store)
    setOnboardingPageNumber(onboardingPageNumber + 1);
  };

  return (
    <>
      <p className="text-[39px] font-semibold text-center uppercase text-white-100">Create your Profile</p>

      <div className="flex flex-col gap-2">
        <Form {...form}>
          <FormField
            control={form.control}
            name="profilePictureUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-[20px] pt-6 text-center text-pink-50")}>Add profile pic</FormLabel>
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
                        "cursor-not-allowed": isUploading,
                      },
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
                      <div className="relative size-[300px]">
                        <Image
                          width={300}
                          height={300}
                          src={selectedImage}
                          alt="Profile preview"
                          className="aspect-square size-[300px] w-full rounded-md object-cover"
                        />

                        {/* Loading overlay */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                              <p className="text-sm">Uploading...</p>
                            </div>
                          </div>
                        )}

                        {/* Success indicator */}
                        {isImageUploaded && !isUploading && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Hidden file input - separate from form field */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      style={{ display: "none" }}
                      disabled={isUploading}
                    />

                    {/* Hidden input for form validation */}
                    <input type="hidden" {...field} value={field.value} />

                    <div className="pt-2 border-b-pink-50 border-b-2" />
                  </div>
                </FormControl>
                <FormDescription className={cn("text-[20px] text-left mt-2 text-pink-50 pt-1")}>
                  {isUploading
                    ? "Uploading your picture..."
                    : isImageUploaded
                      ? "Picture uploaded successfully!"
                      : "You can always change your picture!"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>

      <Button
        disabled={!isImageUploaded || isUploading}
        onClick={onContinue}
        className={cn(
          "text-[20px] uppercase font-semibold h-[60px] w-full text-white-100 hover:bg-pink-80 border border-pink-50",
          {
            "bg-pink-50": !isImageUploaded || isUploading,
            "bg-pink-100": isImageUploaded && !isUploading,
          },
        )}
      >
        {isUploading ? "Uploading..." : isImageUploaded ? "Continue" : "Upload Image First"}
      </Button>
    </>
  );
}
