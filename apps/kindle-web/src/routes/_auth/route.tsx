import { AppSidebar } from '@/components/AppSideBar';
import { Loader } from '@/components/Loader';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
});

function RouteComponent() {
  // const { data: session, isPending } = authClient.useSession();

  // if (isPending) {
  //   return <Loader />;
  // }
  // if (session) {
  return (
    <SidebarProvider className="h-full w-full">
      <AppSidebar />
      <main className="h-full w-full flex flex-col">
        <div className="px-4 flex-none">
          <SidebarTrigger className="-ml-1.5" />
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
  // }
  // return <Navigate to="/login" />;
}
