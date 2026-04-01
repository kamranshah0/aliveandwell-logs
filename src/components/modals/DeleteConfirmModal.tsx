import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
};

export const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2 pt-4 text-center">
          <div className="bg-danger-500/10 p-3 rounded-full mb-2">
            <Trash2 className="size-10 text-danger-500" />
          </div>
          <DialogTitle className="text-xl font-bold text-text-high-em">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-text-med-em text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-3 sm:justify-center pt-6 pb-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading} 
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-11"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
