import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";

type ModalDialogType = {
  trigger: any;
  title: string;
  description?: string;
  content?: any;
  footer?: any;
  closeText?: string;
};

export default function ModalDialog({ trigger, title, description, content, footer, closeText }: ModalDialogType) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content && content}
        {footer && (
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
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
