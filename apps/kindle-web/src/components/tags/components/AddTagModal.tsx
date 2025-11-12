import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { TextInput } from '@/components/formFields/TextInput';
import { CheckCircle2Icon, Loader2 } from 'lucide-react';
import { AddTagFormValue } from '../types';
import { Alert, AlertTitle } from '@/components/ui/alert';

const ZOD_SCHEMA = z.object({
  shortForm: z.string().min(1, 'Short form is required'),
  longForm: z.string().min(1, 'Long form is required'),
});

type ShortLongFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddTagFormValue) => Promise<void>;
};

export function AddTagModal({ open, onOpenChange, onSubmit }: ShortLongFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const form = useForm({
    defaultValues: { shortForm: '', longForm: '' },
    validationLogic: revalidateLogic({ mode: 'submit', modeAfterSubmission: 'change' }),
    validators: { onDynamic: ZOD_SCHEMA },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        await onSubmit(value);
        onOpenChange(false);
      } catch (e: any) {
        setError(e?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {error ? (
            <Alert variant="destructive">
              <CheckCircle2Icon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          ) : null}
          <form.Field
            name="shortForm"
            children={field => (
              <TextInput
                id="shortForm"
                label="Short Form"
                onChange={e => field.handleChange(e.target.value)}
                placeholder="Enter short form"
                errors={field.state.meta.errors}
                intent={field.state.meta.isValid ? 'default' : 'error'}
                required
              />
            )}
          />
          <form.Field
            name="longForm"
            children={field => (
              <TextInput
                id="longForm"
                label="Long Form"
                onChange={e => field.handleChange(e.target.value)}
                placeholder="Enter long form"
                errors={field.state.meta.errors}
                intent={field.state.meta.isValid ? 'default' : 'error'}
                required
              />
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={loading} loading={loading} type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
