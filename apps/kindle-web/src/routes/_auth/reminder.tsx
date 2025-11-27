import { isomorphicFetch } from '@/lib/isomorphicFetch';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/reminder')({
  component: RouteComponent,
  loader: async () => {
    try {
      console.log('Hello in loader of reminder page');
      const response = await isomorphicFetch('/api/notes/reminders');
      const reminderNotes = await response.json();
      return { notes: reminderNotes };
    } catch (e) {
      console.log(e);
      return { error: 'Failed to fetch books' };
    }
  },
});

function RouteComponent() {
  const { error, notes } = Route.useLoaderData();
  console.log(notes, error, 'notes');
  return <div>Hello "/_auth/reminder"!</div>;
}
