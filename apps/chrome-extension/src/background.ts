import { BASE_API_URL, MESSAGE_TYPES } from './constants.js';
import type { MessageType } from './types/message.js';
import { createOffScreen } from './utils/createOffScreen.js';
import type { BookDTO } from '@repo/types/book';

import fetchWithCookie from './utils/fetch.js';
import { text } from './data.js';

const main = async () => {
  // const response = await fetchWithCookie('/notebook');
  // const text = await response.text();

  await createOffScreen();
  const { books } = await chrome.runtime.sendMessage<MessageType, { books: BookDTO }>({
    type: MESSAGE_TYPES.PARSE_HTML,
    html: text,
  });

  // save books in DB
  await fetch(`${BASE_API_URL}/api/books`, {
    credentials: 'include',
    body: JSON.stringify({ books }),
    method: 'POST',
  });
};

main();
