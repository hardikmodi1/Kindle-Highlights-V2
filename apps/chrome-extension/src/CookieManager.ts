import { COOKIE_NAME, KINDLE_NOTE_BOOK_BASE_URL } from './constants.js';

export class CookieManager {
  private cookie: chrome.cookies.Cookie | null = null;

  static instance: CookieManager | null = null;

  static getInstance() {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  public async setCookie() {
    const cookie = await chrome.cookies.get({
      url: KINDLE_NOTE_BOOK_BASE_URL,
      name: COOKIE_NAME,
    });
    this.cookie = cookie;
  }

  public async getCookie() {
    if (!this.cookie) {
      await this.setCookie();
    }
    return this.cookie;
  }
}
