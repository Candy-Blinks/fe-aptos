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
import { Trash2 } from "lucide-react";
import UploadWallets from "./upload-allowlist";
import Image from "next/image";
import { ASSETS_URL } from "@/lib/constants";
import { TooltipContext } from "@/components/tooltip";

export default function EditPhaseForm() {
  const form = useFormContext<IPhaseEditorSchema>();

  const { append, remove } = useFieldArray({
    control: form.control,
    name: "phases",
  });

  return (
    <>
      <div className="w-full border border-white-12 flex flex-col gap-4 p-4 rounded-[8px]">
        <FormField
          control={form.control}
          name="editPhaseForm.label"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn("text-white-100 ty-descriptions")}>Phase name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-1">
          <FormField
            control={form.control}
            name="editPhaseForm.startDate.timestamp"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex items-center gap-1">
                  <Switch
                    checked={form.watch("editPhaseForm.startDate.enabled")}
                    onCheckedChange={(e) => {
                      form.setValue("editPhaseForm.startDate.enabled", e);
                    }}
                  />
                  <FormLabel className={cn("text-white-100 ty-descriptions")}>Start Date & Time</FormLabel>
                </div>

                <DateTimePicker
                  disabled={!form.watch("editPhaseForm.startDate.enabled")}
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
            name="editPhaseForm.endDate.timestamp"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex items-center gap-1">
                  <Switch
                    checked={form.watch("editPhaseForm.endDate.enabled")}
                    onCheckedChange={(e) => {
                      form.setValue("editPhaseForm.endDate.enabled", e);
                    }}
                  />

                  <FormLabel className={cn("text-white-100 ty-descriptions")}>End Date & Time</FormLabel>
                </div>
                <DateTimePicker
                  disabled={!form.watch("editPhaseForm.endDate.enabled")}
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
              name="editPhaseForm.mintLimit.limit"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={form.watch("editPhaseForm.mintLimit.enabled")}
                      onCheckedChange={(e) => {
                        form.setValue("editPhaseForm.mintLimit.enabled", e);
                      }}
                    />
                    <FormLabel className={cn("flex justify-center items-center text-white-100 ty-descriptions")}>
                      <p>Mint limit</p>

                      <div className="ms-1 flex h-full items-center justify-center">
                        <TooltipContext
                          trigger={
                            <Image width={14} height={14} alt="hepl icon" src={ASSETS_URL + "icons/help-circle.svg"} />
                          }
                          description="Mint limit"
                        />
                      </div>
                    </FormLabel>
                  </div>

                  <Input {...field} type="number" disabled={!form.watch("editPhaseForm.mintLimit.enabled")} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-1 basis-[49.9%]">
            <FormField
              control={form.control}
              name="editPhaseForm.allocation.limit"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={form.watch("editPhaseForm.allocation.enabled")}
                      onCheckedChange={(e) => {
                        form.setValue("editPhaseForm.allocation.enabled", e);
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

                  <Input {...field} type="number" disabled={!form.watch("editPhaseForm.allocation.enabled")} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-1">
            <Switch
              checked={form.watch("editPhaseForm.aptosPayment.enabled")}
              onCheckedChange={(e) => {
                form.setValue("editPhaseForm.aptosPayment.enabled", e);
              }}
            />
            <FormLabel className={cn("flex justify-center items-center text-white-100 ty-descriptions")}>
              <p>SOL Payment</p>
              <div className="ms-1 flex h-full items-center justify-center">
                <TooltipContext
                  trigger={<Image width={14} height={14} alt="hepl icon" src={ASSETS_URL + "icons/help-circle.svg"} />}
                  description="SOL Payment"
                />
              </div>
            </FormLabel>
          </div>

          <div className="w-full flex items-center gap-1">
            <div className="basis-[20%]">
              <FormField
                control={form.control}
                name="editPhaseForm.aptosPayment.amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <Input {...field} type="number" disabled={!form.watch("editPhaseForm.aptosPayment.enabled")} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="basis-[80%]">
              <FormField
                control={form.control}
                name="editPhaseForm.aptosPayment.user"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <Input {...field} disabled={!form.watch("editPhaseForm.aptosPayment.enabled")} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* // allow list section */}
        {/* // needs to be a form field and item */}
        <UploadWallets />

        <div className="w-full flex items-center justify-between">
          <Button
            className="bg-white-8 font-semibold text-[18px]"
            onClick={() => {
              remove(form.getValues("editPhaseFormId"));

              form.setValue("editPhaseForm", undefined);
              form.setValue("editPhaseFormId", undefined);
            }}
          >
            <Trash2 /> Delete
          </Button>

          <div className="flex items-center gap-1">
            <Button
              className="bg-transparent"
              onClick={() => {
                form.setValue("editPhaseFormId", undefined);
                form.setValue("editPhaseForm", undefined);
                form.resetField("createPhaseForm");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                remove(form.getValues("editPhaseFormId"));

                // TODO: Fix lintiing error
                // @ts-ignore
                append(form.getValues("editPhaseForm"));

                form.setValue("editPhaseFormId", undefined);
                form.setValue("editPhaseForm", undefined);

                form.setValue("createPhaseForm", PhaseFormSchemaDefaults);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
