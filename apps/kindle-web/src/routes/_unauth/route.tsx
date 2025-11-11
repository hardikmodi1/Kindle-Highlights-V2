import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';
import { Loader } from '@/components/Loader';

export const Route = createFileRoute('/_unauth')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession();
  console.log(session);

  if (isPending) {
    return <Loader />;
  }
  if (session) {
    return <Navigate to="/library" />;
  }
  return <Outlet />;
}
