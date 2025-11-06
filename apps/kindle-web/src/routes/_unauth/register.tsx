import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/formFields/TextInput';
import { Logo } from '@/components/Logo';
import { CheckCircle2Icon, Loader2 } from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import { NavBar } from '@/components/unauth/components/NavBar';
import { FormContainer } from '@/components/unauth/components/FormContainer';
import { Alert, AlertTitle } from '@/components/ui/alert';

export const Route = createFileRoute('/_unauth/register')({ component: SignupComponent });

const ZOD_SCHEMA = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
});

function SignupComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const form = useForm({
    defaultValues: { name: '', email: '', password: '' },
    validators: {
      onChange: ZOD_SCHEMA,
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        callbackURL: '/dashboard',
        fetchOptions: {
          onRequest: () => setLoading(true),
          onSuccess: () => setLoading(false),
          onError: () => setLoading(false),
        },
      });
      if (error) {
        setError(error.message || 'Something went wrong');
      }
    },
  });
  return (
    <>
      <NavBar>
        <Button variant="link" asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      </NavBar>

      <FormContainer header="Create an Account">
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
            name="name"
            children={field => (
              <TextInput
                onChange={e => field.handleChange(e.target.value)}
                id="name"
                label="Name"
                placeholder="Enter name"
                errors={field.state.meta.errors}
                intent={field.state.meta.isValid ? 'default' : 'error'}
              />
            )}
          />
          <form.Field
            name="email"
            children={field => (
              <TextInput
                id="email"
                label="Email"
                type="email"
                onChange={e => field.handleChange(e.target.value)}
                placeholder="Enter email"
                errors={field.state.meta.errors}
                intent={field.state.meta.isValid ? 'default' : 'error'}
              />
            )}
          />
          <form.Field
            name="password"
            children={field => (
              <TextInput
                id="password"
                label="Password"
                onChange={e => field.handleChange(e.target.value)}
                placeholder="Enter password"
                errors={field.state.meta.errors}
                type="password"
                intent={field.state.meta.isValid ? 'default' : 'error'}
              />
            )}
          />
          <Button disabled={loading} type="submit">
            {loading ? <Loader2 className="size-4 animate-spin" /> : null} Create Account
          </Button>
        </form>
      </FormContainer>
    </>
  );
}
