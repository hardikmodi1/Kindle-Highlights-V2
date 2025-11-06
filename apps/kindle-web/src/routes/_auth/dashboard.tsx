import { createFileRoute, Navigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_auth/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 size={48} className="animate-spin" />
      </div>
    );
  }
  if (session) {
    return <div>Hello "/_auth/dashboard"!</div>;
  }
  return <Navigate to="/login" />;
}
