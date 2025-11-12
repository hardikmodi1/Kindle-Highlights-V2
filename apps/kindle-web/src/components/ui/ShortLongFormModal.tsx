import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { TextInput } from '@/components/formFields/TextInput';

const ZOD_SCHEMA = z.object({
  shortForm: z.string().min(1, 'Short form is required'),
  longForm: z.string().min(1, 'Long form is required'),
});

type ShortLongFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { shortForm: string; longForm: string }) => void;
};

export function ShortLongFormModal({ open, onOpenChange, onSubmit }: ShortLongFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const form = useForm({
    defaultValues: { shortForm: '', longForm: '' },
    validators: { onChange: ZOD_SCHEMA },
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
          <DialogTitle>Add Short & Long Form</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {error ? <div className="text-red-500">{error}</div> : null}
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
              />
            )}
          />
          <DialogFooter>
            <Button disabled={loading} type="submit">
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
