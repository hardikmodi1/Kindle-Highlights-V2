import { COOKIE_NAME, KINDLE_NOTE_BOOK_BASE_URL } from '../constants.js';
import { CookieManager } from '../CookieManager.js';

const fetchWithCookie = async (input: string, init?: RequestInit): Promise<Response> => {
  const cookie = await CookieManager.getInstance().getCookie();
  return fetch(`${KINDLE_NOTE_BOOK_BASE_URL}${input}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...init?.headers,
      // Cookie: `${COOKIE_NAME}=${cookie?.value};`,
    },
  });
};

export default fetchWithCookie;
