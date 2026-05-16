export interface DailyQt {
  id: string;
  qt_date: string;
  bible_book: string;
  chapter: number;
  verse_from: number;
  verse_to: number;
  content?: string;
}
