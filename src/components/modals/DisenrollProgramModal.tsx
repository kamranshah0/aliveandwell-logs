import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disenrollProgram } from "@/api/patientProgram.api";
import { notify } from "@/components/ui/notify";
import { HandHeart, LogOut } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  programs: {
    enrollmentId: string;
    programName: string;
  }[];
};

const DisenrollProgramModal = ({ open, onClose, programs }: Props) => {
  const queryClient = useQueryClient();

  /** Tracks which program is currently being processed */
  const [pendingEnrollmentId, setPendingEnrollmentId] = useState<string | null>(
    null
  );

  const mutation = useMutation({
    mutationFn: disenrollProgram,
    onSuccess: () => {
      notify.success("Program disenrolled successfully");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setPendingEnrollmentId(null);
      onClose();
    },
    onError: () => {
      notify.error("Failed to disenroll program");
      setPendingEnrollmentId(null);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader className="flex gap-2 items-center">
          <HandHeart className="size-6 text-text-primary" />
          <DialogTitle>Disenroll Programs</DialogTitle>
        </DialogHeader>

        {programs.length === 0 ? (
          <p className="text-sm text-text-low-em">No programs enrolled</p>
        ) : (
          <div className="flex flex-col gap-3">
            {programs.map((program) => {
              const isPending = pendingEnrollmentId === program.enrollmentId;

              return (
                <div
                  key={program.enrollmentId}
                  className="flex items-center justify-between border rounded-lg p-3"
                >  
                  <span className="text-text-high-em text-base">
                    {program.programName}
                  </span>

                  <Button
                    size="sm"
                    variant="outlinedestructive"
                    disabled={isPending}
                    onClick={() => {
                      setPendingEnrollmentId(program.enrollmentId);
                      mutation.mutate(program.enrollmentId);
                    }}
                  >
                    {isPending ? (
                      <>
                        Disenrolling
                        <svg
                          className="animate-spin size-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        Disenroll <LogOut />
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DisenrollProgramModal;
