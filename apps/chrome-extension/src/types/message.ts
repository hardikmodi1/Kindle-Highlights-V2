import type { MESSAGE_TYPES } from '../constants.js';

type ParseHtmlMessage = {
  type: typeof MESSAGE_TYPES.PARSE_HTML;
  html: string;
};

export type MessageType = ParseHtmlMessage;
