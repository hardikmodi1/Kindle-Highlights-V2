import { auth } from '@/lib/auth';
import { createFileRoute } from '@tanstack/react-router';
import { oAuthProtectedResourceMetadata } from 'better-auth/plugins';

export const Route = createFileRoute('/.well-known/oauth-protected-resource')({
  server: { handlers: { GET: ({ request }) => oAuthProtectedResourceMetadata(auth)(request) } },
});
