import fetchWithCookie from './utils/fetch.js';

const main = async () => {
  const response = await fetchWithCookie('/notebook');
  const text = await response.text();
  console.log(text);
};

main();
