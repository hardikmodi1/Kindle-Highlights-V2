import type { NoteDTO } from '@repo/types/note';
import { KINDLE_NOTE_BOOK_BASE_URL, MESSAGE_TYPES } from './constants.js';
import type { MessageType } from './types/message.js';
import fetchWithCookie from './utils/fetch.js';
import { scrapBooksData } from './utils/scrapBooksData.js';
import { scrapNotesData } from './utils/scrapNotesData.js';

chrome.runtime.onMessage.addListener((message: MessageType, sender, sendResponse) => {
  (async () => {
    switch (message.type) {
      case MESSAGE_TYPES.PARSE_BOOKS: {
        const parser = new DOMParser();
        const doc = parser.parseFromString(message.html, 'text/html');
        const books = scrapBooksData(doc);

        sendResponse({ books });
        break;
      }

      case MESSAGE_TYPES.PARSE_NOTES: {
        let contentLimitState = '',
          token = '';
        let allNotes: NoteDTO[] = [];

        do {
          const notesResponse = await fetch(
            `${KINDLE_NOTE_BOOK_BASE_URL}/notebook?asin=${message.asin}&token=${token}&contentLimitState=${contentLimitState}&`
          );
          const notesText = await notesResponse.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(notesText, 'text/html');

          const currentPageNotes = scrapNotesData(doc.body.children);
          allNotes.push(...currentPageNotes);

          contentLimitState =
            doc.body.getElementsByClassName('kp-notebook-content-limit-state')[0]?.getAttribute('value') || '';
          token =
            doc.body.getElementsByClassName('kp-notebook-annotations-next-page-start')[0]?.getAttribute('value') || '';
        } while (token !== '');

        console.log('Total notes fetched:', allNotes.length);
        sendResponse({ notes: allNotes });
        // return true;
        break;
      }
      default:
        break;
    }
  })();
  return true;
});
