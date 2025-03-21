
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

export const DeleteJobDialog = ({ 
  open, 
  onOpenChange, 
  onConfirmDelete 
}: DeleteJobDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p className="py-4">
          Are you sure you want to delete this job? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
