import prisma from '@/lib/prisma';
import { createServerOnlyFn } from '@tanstack/react-start';
import { OAuthAccessToken } from 'better-auth/plugins';

export const createTag = createServerOnlyFn(
  async ({
    session,
    inputParams: { longForm, shortForm },
  }: {
    session: OAuthAccessToken;
    inputParams: { longForm: string; shortForm: string };
  }) => {
    const userId = session.userId;

    try {
      await prisma.tag.create({ data: { longForm, shortForm, userId } });
      return {
        content: [{ type: 'text' as const, text: `I have created tag ${shortForm} - ${longForm} successfully!` }],
      };
    } catch (e) {
      return { content: [{ type: 'text' as const, text: `Something went wrong - ${e}` }] };
    }
  }
);
