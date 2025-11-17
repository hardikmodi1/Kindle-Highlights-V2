import type { NoteDTO } from '@repo/types/note';

export const scrapNotesData = (highlightsContainer: HTMLCollection) => {
  const notes: NoteDTO[] = [];
  for (const highlight of highlightsContainer) {
    const highlightContainer = highlight.getElementsByClassName('kp-notebook-highlight-yellow')[0];
    if (highlightContainer) {
      const highlightedText = highlightContainer.textContent?.trim() as string;
      const note = highlight
        .getElementsByClassName('kp-notebook-note')[0]
        ?.getElementsByTagName('span')[2]?.textContent;

      notes.push({
        highlightedText,
        note,
      });
    }
  }

  return notes;
};
