import { MESSAGE_TYPES } from './constants.js';
import type { MessageType } from './types/message.js';

chrome.runtime.onMessage.addListener(async (message: MessageType, sender, sendResponse) => {
  switch (message.type) {
    case MESSAGE_TYPES.PARSE_HTML:
      const parser = new DOMParser();
      const doc = parser.parseFromString(message.html, 'text/html');

      break;
    default:
      break;
  }
});
