import { DataTable } from '@/components/DataTable';
import { columns } from '@/components/tags/columns';
import { AddTagModal } from '@/components/tags/components/AddTagModal';
import { AddTagFormValue } from '@/components/tags/types';
import { Button } from '@/components/ui/button';
import { isomorphicFetch } from '@/lib/isomorphicFetch';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { XCircle } from 'lucide-react';
import { ErrorScreen } from '@/components/ErrorScreen';

export const Route = createFileRoute('/_auth/manage-tags')({
  component: RouteComponent,
  loader: async () => {
    try {
      const response = await isomorphicFetch('/api/tags');
      return { tags: await response.json() };
    } catch (e) {
      return { error: 'Failed to fetch tags' };
    }
  },
});

function RouteComponent() {
  const { tags, error } = Route.useLoaderData();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const onSubmitTag = useCallback(async (value: AddTagFormValue) => {
    await fetch('/api/tags', {
      method: 'POST',
      body: JSON.stringify(value),
    });
    router.invalidate();
  }, []);

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-2xl font-bold">Tags</p>
        <Button onClick={() => onOpenChange(true)}>
          <PlusIcon />
          Add Tag
        </Button>
      </div>
      <DataTable columns={columns} data={tags} />
      <AddTagModal onOpenChange={onOpenChange} open={isOpen} onSubmit={onSubmitTag} />
    </div>
  );
}
