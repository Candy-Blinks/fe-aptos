"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ICollectionInformationSchema } from "@/lib/schemas/create_launchpad.schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStore } from "@/store/store";
import UploadBanner from "./upload-banner";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
export default function CollectionInformationForm() {
  const { control, trigger, watch } =
    useFormContext<ICollectionInformationSchema>();

  const { createPage, setCreatePage, collectionBanner } = useStore();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "royalties",
  });

  const { account } = useWallet();

  const onProceed = async () => {
    const valid = await trigger();

    if (!collectionBanner) {
      console.log(collectionBanner);

      toast("Collection banner is required");

      return;
    }
    if (valid) {
      setCreatePage(createPage + 1);
      console.log(createPage);
    }
  };

  useEffect(() => {
    if (account && fields.length == 0) {
      remove();
      append({ shares: "100", wallet: account.address.toString() });
    }
  }, [account, fields, append, remove]);

  return (
    <div className="w-full p-4 flex flex-col gap-8 bg-white-4 shadow-lg rounded-lg border border-white-4">
      <p className="text-white-100 text-[20px] ty-h6 font-extrabold">
        Candy Store Information
      </p>

      <div className="w-full flex gap-4 justify-center">
        <div className="basis-[50%] flex flex-col gap-4">
          <div className="w-full flex justify-between gap-2">
            <FormField
              control={control}
              name="collectionName"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 basis-[50%]">
                  <FormLabel className="text-[18px] font-semibold">
                    Collection name
                  </FormLabel>
                  <FormControl className="h-[30px] rounded-sm">
                    <Input
                      className="text-white placeholder:text-white-32 ty-subtext ps-2 focus:outline-none placeholder:ty-subtext placeholder:font-medium font-medium text-[14px] placeholder:text-[14px]"
                      placeholder="Insert Collection Name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="collectionSymbol"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 basis-[50%]">
                  <FormLabel className="text-[18px] font-semibold">
                    Symbol
                  </FormLabel>
                  <FormControl className="h-[30px] rounded-sm">
                    <Input
                      className="text-white placeholder:text-white-32 ty-subtext ps-2 focus:outline-none placeholder:ty-subtext placeholder:font-medium font-medium text-[14px] placeholder:text-[14px]"
                      placeholder="Insert Collection Symbol"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="collectionDescription"
            render={({ field }) => {
              const charCount = field.value?.length || 0;
              const isNearLimit = charCount > 250 * 0.8;
              const isAtLimit = charCount >= 250;

              return (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-[18px] font-semibold">
                      Description
                    </FormLabel>
                    <span
                      className={`text-sm ${
                        isAtLimit
                          ? "text-destructive"
                          : isNearLimit
                          ? "text-amber-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {charCount}/250
                    </span>
                  </div>
                  <FormControl className="rounded-sm">
                    <Textarea
                      className="text-white placeholder:text-white-32 ty-subtext ps-2 focus:outline-none placeholder:ty-subtext placeholder:font-medium font-medium text-[14px] placeholder:text-[14px]"
                      placeholder="Insert Collection Description"
                      maxLength={250}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <div className="basis-[50%] flex flex-col gap-1">
          <p className="text-[18px] font-semibold">Collection Banner</p>

          <UploadBanner />
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 justify-center">
        <p className=" text-[18px] font-semibold pb-[10px]">
          Secondary royalties
        </p>

        {fields.map((e, index) => {
          return (
            <div key={e.id} className="w-full flex items-end gap-4">
              <FormField
                control={control}
                name={`royalties.${index}.shares`}
                render={({ field }) => (
                  <FormItem className="w-full max-w-[90px] flex flex-col gap-1">
                    <FormLabel className="text-[18px] font-normal">
                      Shares
                    </FormLabel>
                    <FormControl className="h-[30px] rounded-sm">
                      <Input
                        className="text-white placeholder:text-white-32 ty-subtext ps-2 focus:outline-none placeholder:ty-subtext placeholder:font-medium font-medium text-[14px] placeholder:text-[14px]"
                        placeholder="Shares (%)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`royalties.${index}.wallet`}
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col gap-1">
                    <FormLabel className="text-[18px] font-normal">
                      Wallet Address
                    </FormLabel>
                    <FormControl className="h-[30px] rounded-sm">
                      <Input
                        className="text-white placeholder:text-white-32 ty-subtext ps-2 focus:outline-none placeholder:ty-subtext placeholder:font-medium font-medium text-[14px] placeholder:text-[14px]"
                        placeholder="Wallet Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-1">
                <div className=""></div>

                <Button
                  onClick={() => {
                    remove(index);
                  }}
                  size={"icon"}
                  className={cn("")}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          );
        })}

        {watch("royalties").length < 3 && (
          <Button
            onClick={() => {
              append({ shares: "0", wallet: "" });
            }}
            className="border-2 border-dashed border-white-4 shadow-lg rounded-lg bg-black"
          >
            <div className="flex items-center">
              <Image
                src="/images/add.png"
                alt="upload"
                width={16}
                height={16}
              />
              <span className="ty-subtext pl-2 text-[14px]">Add split</span>
            </div>
          </Button>
        )}
      </div>
      <div className="w-full flex flex-col gap-4 justify-center">
        <div className="flex w-full flex-wrap gap-4">
          <FormField
            control={control}
            name="website"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 basis-[48%]">
                <FormLabel className="md:text-[18px] font-semibold">
                  Website
                </FormLabel>
                <FormControl className="h-[30px] rounded-sm">
                  <Input
                    className="text-white placeholder:text-white-32 ty-subtext ps-2 focus:outline-none placeholder:ty-subtext placeholder:font-medium font-medium text-[14px] placeholder:text-[14px]"
                    placeholder="Enter Website Link"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="x"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 basis-[48%]">
                <FormLabel className="md:text-[18px] font-semibold">
                  X
                </FormLabel>
                <FormControl className="h-[30px] rounded-sm">
                  <Input
                    className="text-white placeholder:text-white-32 ty-subtext ps-2 focus:outline-none placeholder:ty-subtext placeholder:font-medium font-medium text-[14px] placeholder:text-[14px]"
                    placeholder="Enter X Link"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="discord"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 basis-[48%]">
                <FormLabel className="md:text-[18px] font-semibold">
                  Discord (Optional)
                </FormLabel>
                <FormControl className="h-[30px] rounded-sm">
                  <Input
                    className="text-white placeholder:text-white-32 ty-subtext ps-2 focus:outline-none placeholder:ty-subtext placeholder:font-medium font-medium text-[14px] placeholder:text-[14px]"
                    placeholder="Enter Discord Link"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="ig"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 basis-[48%]">
                <FormLabel className="md:text-[18px] font-semibold">
                  Instagram (Optional)
                </FormLabel>
                <FormControl className="h-[30px] rounded-sm">
                  <Input
                    className="text-white placeholder:text-white-32 ty-subtext ps-2 focus:outline-none placeholder:ty-subtext placeholder:font-medium font-medium text-[14px] placeholder:text-[14px]"
                    placeholder="Enter Instagram Link"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="yt"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 basis-[48%]">
                <FormLabel className="md:text-[18px] font-semibold">
                  Youtube (Optional)
                </FormLabel>
                <FormControl className="h-[30px] rounded-sm">
                  <Input
                    className="text-white placeholder:text-white-32 ty-subtext ps-2 focus:outline-none placeholder:ty-subtext placeholder:font-medium font-medium text-[14px] placeholder:text-[14px]"
                    placeholder="Enter Youtube Link"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="tg"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 basis-[48%]">
                <FormLabel className="md:text-[18px] font-semibold">
                  Telegram (Optional)
                </FormLabel>
                <FormControl className="h-[30px] rounded-sm">
                  <Input
                    className="text-white placeholder:text-white-32 ty-subtext ps-2 focus:outline-none placeholder:ty-subtext placeholder:font-medium font-medium text-[14px] placeholder:text-[14px]"
                    placeholder="Enter Telegram Link"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="w-full flex items-center justify-end">
        <Button
          onClick={onProceed}
          className="text-xl bg-pink-32 hover:bg-red-500 text-white dm-sans py-[8px] px-[32px] font-bold rounded-[4px]"
        >
          <span className="text-[18px]">Next</span>
        </Button>
      </div>
    </div>
  );
}
