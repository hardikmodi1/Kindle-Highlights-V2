import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/_unauth')({
  component: RouteComponent,
});

function RouteComponent() {
  // const { data: session, isPending } = authClient.useSession();
  // console.log(session);

  // if (isPending) {
  //   return (
  //     <div className="h-full w-full flex items-center justify-center">
  //       <Loader2 size={48} className="animate-spin" />
  //     </div>
  //   );
  // }
  // if (session) {
  //   return <Navigate to="/dashboard" />;
  // }
  return <Outlet />;
}
