export type NoteDTO = {
  highlightedText: string;
  note: string | undefined;
  highlightId: string;
  noteId?: string | undefined;
  location?: string | null | undefined;
};
