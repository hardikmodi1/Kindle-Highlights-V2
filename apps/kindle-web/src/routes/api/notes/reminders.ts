import { auth } from '@/lib/auth';
import { createFileRoute } from '@tanstack/react-router';
import { generateReminders } from '@/utils/generateReminders';

export const Route = createFileRoute('/api/notes/reminders')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sessionData = await auth.api.getSession(request);
        const userId = sessionData?.session?.userId;
        if (userId) {
          const reminderNotes = await generateReminders(userId);
          return new Response(JSON.stringify(reminderNotes));
        }
        return new Response(null, { status: 401 });
      },
    },
  },
});
