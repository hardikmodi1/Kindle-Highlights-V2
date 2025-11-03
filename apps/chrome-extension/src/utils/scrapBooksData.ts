export const scrapBooksData = (doc: Document) => {
  const booksContainer = doc.getElementsByClassName('kp-notebook-library-each-book');

  for (const book of booksContainer) {
    const coverImageUrl = book.getElementsByClassName('kp-notebook-cover-image')[0]?.getAttribute('src');
    const asin = book.getAttribute('id');
    const title = book.getElementsByTagName('h2')[0]?.textContent;
    const authorText = book.getElementsByTagName('p')[0]?.textContent;
    // amazon format: "By: Author1, Author2 and Author3 or By: Author1"
    const authorsString = authorText?.split('By: ')[1] ?? '';
    const authors = authorsString
      .replace(/ and /g, ', ') // replace " and " with a comma
      .split(',') // split by comma
      .map(s => s.trim());
  }
};
