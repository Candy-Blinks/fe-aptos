"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/store";
import { FormProvider, useForm } from "react-hook-form";
import {
  IPhaseEditorSchema,
  PhaseEditorSchema,
  PhaseEditorSchemaDefaults,
} from "@/lib/schemas/edit_phase.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import AddPhaseForm from "./add-phase-form";
import EditPhaseForm from "./edit-phase-form";
import CurrentPhases from "./current-phases";
import NewChanges from "./new-changes";

interface PhaseEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PhaseEditorDialog({
  open,
  onOpenChange,
}: PhaseEditorDialogProps) {
  const { hubPhases } = useStore();

  const form = useForm<IPhaseEditorSchema>({
    resolver: zodResolver(PhaseEditorSchema),
    defaultValues: PhaseEditorSchemaDefaults,
  });

  useEffect(() => {
    form.setValue(
      "phases",
      hubPhases.map((phase: any) => {
        return {
          label: phase.label,
          endDate: {
            enabled: phase.endDate != null,
            timestamp: new Date(),
          },
          startDate: {
            enabled: phase.startDate != null,
            timestamp: new Date(),
          },
          aptosPayment: {
            enabled: phase.aptosPayment != null || phase.solPayment != null, // Handle both for backwards compatibility
            user:
              phase.aptosPayment?.user != null
                ? phase.aptosPayment.user
                : phase.solPayment?.user != null
                ? phase.solPayment.user
                : undefined,
            amount:
              phase.aptosPayment?.amount != null 
                ? phase.aptosPayment.amount 
                : phase.solPayment?.amount != null 
                ? phase.solPayment.amount 
                : 1,
          },
          allocation: {
            enabled: phase.allocation != null,
            id:
              phase.allocation?.allocationId != null
                ? phase.allocation?.allocationId
                : undefined,
            limit: phase.allocation?.limit != null ? phase.allocation.limit : 1,
          },
          mintLimit: {
            enabled: phase.mintLimit != null,
            id:
              phase.mintLimit?.mintLimitId != null
                ? phase.mintLimit?.mintLimitId
                : undefined,
            limit: phase.mintLimit?.limit != null ? phase.mintLimit.limit : 1,
          },
        };
      })
    );
  }, [hubPhases, form.setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[840px] bg-black-100 border border-white-12 rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            <p className={cn("ty-h6 text-white-100")}>Phase Editor</p>
          </DialogTitle>
          <DialogDescription className="w-full">
            <FormProvider {...form}>
              <div className="flex w-full gap-4">
                {/*  */}

                <div className="flex flex-col gap-[10px] basis-[49.50%]">
                  {form.watch("editPhaseForm") ? (
                    <EditPhaseForm />
                  ) : (
                    <AddPhaseForm />
                  )}

                  <NewChanges />
                </div>

                <CurrentPhases />
              </div>
            </FormProvider>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
