/** demo 페이지 전용 목데이터 타입 */
export interface DailyWord {
  date: string;
  reference: string;
  title: string;
  text: string;
  keyVerse: string;
}

export interface DailyQt {
  id: string;
  qt_date: string;
  bible_book: string;
  chapter: number;
  verse_from: number;
  verse_to: number;
  content?: string;
}
