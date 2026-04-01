import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import FormLabel from "../molecules/FormLabel";

type RejectReasonDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  title?: string;
  description?: string;
};

export default function RejectReasonDialog({
  open,
  onClose,
  onSubmit,
  title,
  description,
}: RejectReasonDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) return; // empty reason ignore
    onSubmit(reason);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:min-w-[530px] bg-surface-0 rounded-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-outline-low-em">
          <DialogTitle className="text-lg font-semibold text-text-high-em">
            {title ? title : "Reject Reason"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6">
          {description && <p className="text-sm text-text-high-em mb-6">{description}</p>}

          <FormLabel>Decline Reason</FormLabel>
          <Textarea
            placeholder="type here..."
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full text-sm text-text-med-em rounded-xl bg-surface-1 py-2 px-3 border-none h-[120px]"
          />
        </div>

        <div className="bg-surface-0 border-t border-outline-low-em px-6 py-3 flex justify-end gap-5">
          <Button
            variant="ghost"
            className="rounded-lg"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className="rounded-lg" onClick={handleConfirm}>
            Decline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
