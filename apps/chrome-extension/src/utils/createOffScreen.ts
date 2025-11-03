export const createOffScreen = async () => {
  if (await chrome.offscreen.hasDocument()) {
    return;
  }
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['DOM_PARSER'],
    justification: 'To parse the HTML of the Kindle Note Book',
  });
};
