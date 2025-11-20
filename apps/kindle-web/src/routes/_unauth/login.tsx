import { z } from 'zod';
import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';

import { TextInput } from '@/components/formFields/TextInput';
import { Button } from '@/components/ui/button';
import { FormContainer } from '@/components/unauth/components/FormContainer';
import { NavBar } from '@/components/unauth/components/NavBar';
import { Loader2, CheckCircle2Icon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_unauth/login')({ component: LoginComponent });

const ZOD_SCHEMA = z.object({ email: z.string().email(), password: z.string().min(8) });

function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: {
      onChange: ZOD_SCHEMA,
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
        callbackURL: '/library',
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
          <Link to="/register">Create Account</Link>
        </Button>
      </NavBar>

      <FormContainer header="Sign In">
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
            name="email"
            children={field => (
              <TextInput
                type="email"
                id="email"
                label="Email"
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
            {loading ? <Loader2 className="size-4 animate-spin" /> : null} Sign In
          </Button>
        </form>
      </FormContainer>
    </>
  );
}
