import { useMemo } from 'react';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { type Errors } from '@/components/ui/types';
import { type Intent } from './types';

type TextInputProps = React.ComponentProps<'input'> & { label: string; errors?: Errors; intent?: Intent };

export const TextInput = ({ id, label, errors, intent, ...props }: TextInputProps) => {
  const isInvalid = intent === 'error' || !!errors?.length;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} aria-invalid={isInvalid} {...props} />
      <FieldError errors={errors} />
    </Field>
  );
};
