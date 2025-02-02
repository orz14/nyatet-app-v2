import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";

type ModalDialogType = {
  trigger: any;
  title: string;
  description?: string;
  content?: any;
  footer?: any;
  closeText?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  loading?: boolean;
};

export default function ModalDialog({ trigger, title, description, content, footer, closeText, open, setOpen, loading = false }: ModalDialogType) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content && content}
        {footer && (
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                {closeText}
              </Button>
            </DialogClose>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
