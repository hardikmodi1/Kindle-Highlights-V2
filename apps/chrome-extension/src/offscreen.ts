import { MESSAGE_TYPES } from './constants.js';
import type { MessageType } from './types/message.js';
import { scrapBooksData } from './utils/scrapBooksData.js';

chrome.runtime.onMessage.addListener(async (message: MessageType, sender, sendResponse) => {
  switch (message.type) {
    case MESSAGE_TYPES.PARSE_HTML:
      const parser = new DOMParser();
      const doc = parser.parseFromString(message.html, 'text/html');
      const books = scrapBooksData(doc);

      // const response = await fetch('http://localhost:3000/api/books', {
      //   credentials: 'include',
      //   body: JSON.stringify({ books }),
      //   method: 'POST',
      // });
      // console.log(await response.text());
      sendResponse({ books });
      break;
    default:
      break;
  }
});
