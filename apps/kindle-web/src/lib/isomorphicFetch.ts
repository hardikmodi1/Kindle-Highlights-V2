import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const isomorphicFetch = createIsomorphicFn()
  .server(async (input: string | URL | Request, init?: RequestInit) => {
    const headers = getRequestHeaders();
    return fetch(`${process.env.SERVER_URL}${input}`, { headers, ...init });
  })
  .client(async (input: string | URL | Request, init?: RequestInit) => {
    return fetch(input, init);
  });
