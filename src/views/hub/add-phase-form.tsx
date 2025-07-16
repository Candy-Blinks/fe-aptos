"use client";
import React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";

import { useFieldArray, useFormContext } from "react-hook-form";
import { IPhaseEditorSchema, PhaseFormSchemaDefaults } from "@/lib/schemas/edit_phase.schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import DateTimePicker from "./date-time-picker";
import Image from "next/image";
import { ASSETS_URL } from "@/lib/constants";
import UploadWallets from "./upload-allowlist";
import { TooltipContext } from "@/components/tooltip";

export default function AddPhaseForm() {
  const form = useFormContext<IPhaseEditorSchema>();

  const { append, fields } = useFieldArray({
    control: form.control,
    name: "phases",
  });

  const onCreate = () => {
    append(form.getValues("createPhaseForm"));
    form.setValue("createPhaseForm", PhaseFormSchemaDefaults);
  };

  return (
    <>
      <div className="w-full border border-white-12 flex flex-col gap-4 p-4  rounded-[8px]">
        <FormField
          control={form.control}
          name="createPhaseForm.label"
          render={({ field }) => (
            <FormItem className={cn("w-full")}>
              <FormLabel className={cn("text-white-100 ty-descriptions")}>Phase name</FormLabel>
              <FormControl className="h-[32px] rounded-sm">
                <Input
                  className="appearance-none border-0 placeholder:text-white-32 text-[14px] font-normal ps-2 placeholder:text-[14px] h-[32px]"
                  placeholder="Enter Phase Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-1">
          <FormField
            control={form.control}
            name="createPhaseForm.startDate.timestamp"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex items-center gap-1">
                  <Switch
                    checked={form.watch("createPhaseForm.startDate.enabled")}
                    onCheckedChange={(e) => {
                      form.setValue("createPhaseForm.startDate.enabled", e);
                    }}
                  />
                  <FormLabel className={cn("text-white-100 ty-descriptions")}>Start Date & Time</FormLabel>
                </div>

                <DateTimePicker
                  disabled={!form.watch("createPhaseForm.startDate.enabled")}
                  onSelect={field.onChange}
                  date={field.value}
                />

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FormField
            control={form.control}
            name="createPhaseForm.endDate.timestamp"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex items-center gap-1">
                  <Switch
                    checked={form.watch("createPhaseForm.endDate.enabled")}
                    onCheckedChange={(e) => {
                      form.setValue("createPhaseForm.endDate.enabled", e);
                    }}
                  />
                  <FormLabel className={cn("text-white-100 ty-descriptions")}>End Date & Time</FormLabel>
                </div>

                <DateTimePicker
                  disabled={!form.watch("createPhaseForm.endDate.enabled")}
                  onSelect={field.onChange}
                  date={field.value}
                />

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full flex gap-2">
          <div className="flex flex-col gap-1 basis-[49.9%]">
            <FormField
              control={form.control}
              name="createPhaseForm.mintLimit.limit"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={form.watch("createPhaseForm.mintLimit.enabled")}
                      onCheckedChange={(e) => {
                        form.setValue("createPhaseForm.mintLimit.enabled", e);
                      }}
                    />
                    <FormLabel className={cn("flex justify-center items-center text-white-100 ty-descriptions")}>
                      <p>Mint limit</p>
                      <div className="ms-1 flex h-full items-center justify-center">
                        <TooltipContext
                          trigger={
                            <Image width={14} height={14} alt="hepl icon" src={ASSETS_URL + "icons/help-circle.svg"} />
                          }
                          description="Mint Limit"
                        />
                      </div>
                    </FormLabel>
                  </div>

                  <Input
                    {...field}
                    type="number"
                    className="appearance-none rounded-sm border-0 placeholder:text-white-32 text-[14px] font-normal ps-2 placeholder:text-[14px] h-[32px]"
                    placeholder="Enter Limit per wallet"
                    disabled={!form.watch("createPhaseForm.mintLimit.enabled")}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-1 basis-[49.9%]">
            <FormField
              control={form.control}
              name="createPhaseForm.allocation.limit"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={form.watch("createPhaseForm.allocation.enabled")}
                      onCheckedChange={(e) => {
                        form.setValue("createPhaseForm.allocation.enabled", e);
                      }}
                    />
                    <FormLabel className={cn("flex justify-center items-center text-white-100 ty-descriptions")}>
                      <p>Allocation</p>
                      <div className="ms-1 flex h-full items-center justify-center">
                        <TooltipContext
                          trigger={
                            <Image width={14} height={14} alt="hepl icon" src={ASSETS_URL + "icons/help-circle.svg"} />
                          }
                          description="Allocation"
                        />
                      </div>
                    </FormLabel>
                  </div>

                  <Input
                    {...field}
                    type="number"
                    placeholder="Limit NFT for this phase"
                    className="appearance-none rounded-sm border-0 placeholder:text-white-32 text-[14px] font-normal ps-2 placeholder:text-[14px] h-[32px]"
                    disabled={!form.watch("createPhaseForm.allocation.enabled")}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Switch
              checked={form.watch("createPhaseForm.aptosPayment.enabled")}
              onCheckedChange={(e) => {
                form.setValue("createPhaseForm.aptosPayment.enabled", e);
              }}
            />
            <FormLabel className={cn("flex justify-center items-center text-white-100 ty-descriptions")}>
              <p>Price</p>
              <div className="ms-1 flex h-full items-center justify-center">
                <TooltipContext
                  trigger={<Image width={14} height={14} alt="hepl icon" src={ASSETS_URL + "icons/help-circle.svg"} />}
                  description="Price"
                />
              </div>
            </FormLabel>
          </div>

          <div className="w-full flex items-center gap-2">
            <div className="basis-[20%]">
              <FormField
                control={form.control}
                name="createPhaseForm.aptosPayment.amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full h-[32px] rounded-sm">
                    <Input
                      {...field}
                      className="appearance-none rounded-sm border-0 placeholder:text-white-32 text-[14px] font-normal ps-2 placeholder:text-[14px] h-[32px]"
                      type="number"
                      placeholder="Enter Amount"
                      disabled={!form.watch("createPhaseForm.aptosPayment.enabled")}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="basis-[80%]">
              <FormField
                control={form.control}
                name="createPhaseForm.aptosPayment.user"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <Input
                      {...field}
                      className="appearance-none rounded-sm border-0 placeholder:text-white-32 text-[14px] font-normal ps-2 placeholder:text-[14px] h-[32px]"
                      placeholder="Enter Wallet Address"
                      disabled={!form.watch("createPhaseForm.aptosPayment.enabled")}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        {/* // upload wallets allow list needs to be a form field and item */}
        <UploadWallets />
        <div className="w-full flex items-center justify-end">
          <Button onClick={onCreate}>Create</Button>
        </div>
      </div>
    </>
  );
}
