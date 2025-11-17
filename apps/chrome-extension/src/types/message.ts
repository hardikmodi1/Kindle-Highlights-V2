import type { MESSAGE_TYPES } from '../constants.js';

type ParseHtmlMessage = {
  type: typeof MESSAGE_TYPES.PARSE_BOOKS;
  html: string;
};

type ParseNoteMessage = {
  type: typeof MESSAGE_TYPES.PARSE_NOTES;
  asin: string;
};

export type MessageType = ParseHtmlMessage | ParseNoteMessage;
