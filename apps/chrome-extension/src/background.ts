import { BASE_API_URL, MESSAGE_TYPES } from './constants.js';
import type { MessageType } from './types/message.js';
import { createOffScreen } from './utils/createOffScreen.js';

import fetchWithCookie from './utils/fetch.js';
import { text } from './data.js';

const main = async () => {
  // const response = await fetchWithCookie('/notebook');
  // const text = await response.text();
  // const response = await fetch('http://localhost:3000/api/books', {
  //   credentials: 'include',
  //   body: JSON.stringify({ books: [{ name: 'hello' }] }),
  //   method: 'POST',
  // });
  // console.log(await response.text());
  // console.log(text);

  await createOffScreen();
  chrome.runtime.sendMessage<MessageType>(
    {
      type: MESSAGE_TYPES.PARSE_HTML,
      html: text,
    },
    async ({ books }) => {
      const response = await fetch(`${BASE_API_URL}/api/books`, {
        credentials: 'include',
        body: JSON.stringify({ books }),
        method: 'POST',
      });
      console.log(await response.text());
    }
  );
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(text, 'text/html');
  // console.log(doc);
};

main();
