import { auth } from '@/lib/auth';
import { createFileRoute } from '@tanstack/react-router';
import { oAuthDiscoveryMetadata } from 'better-auth/plugins';

export const Route = createFileRoute('/.well-known/oauth-authorization-server')({
  server: { handlers: { GET: ({ request }) => oAuthDiscoveryMetadata(auth)(request) } },
});
