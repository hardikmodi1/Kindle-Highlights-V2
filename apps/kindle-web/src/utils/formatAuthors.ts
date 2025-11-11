export const formatAuthors = (authors?: string[]): string => {
  if (!authors || authors.length === 0) return '';
  if (authors.length === 1) return authors[0];
  return `${authors.slice(0, -1).join(', ')} and ${authors[authors.length - 1]}`;
};
