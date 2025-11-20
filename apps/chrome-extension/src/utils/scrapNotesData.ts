import type { NoteDTO } from '@repo/types/note';

export const scrapNotesData = (highlightsContainer: HTMLCollection) => {
  const notes: NoteDTO[] = [];
  for (const highlight of highlightsContainer) {
    const highlightContainer = highlight.getElementsByClassName('kp-notebook-highlight-yellow')[0];
    if (highlightContainer) {
      const highlightId = highlightContainer.getAttribute('id')?.split('highlight-')[1] ?? '';
      const highlightedText = highlightContainer.textContent?.trim() as string;

      const noteContainer = highlight.getElementsByClassName('kp-notebook-note')[0];
      const noteId = noteContainer?.getAttribute('id')?.split('note-')[1];
      const note = noteContainer?.getElementsByTagName('span')[2]?.textContent;

      const location = highlight.getElementsByTagName('input')[0]?.getAttribute('value');

      notes.push({
        highlightedText,
        note,
        highlightId,
        noteId,
        location,
      });
    }
  }

  return notes;
};
