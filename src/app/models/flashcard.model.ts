export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  isFlipped?: boolean;
}

export interface FlashcardResponse {
  flashcards: Flashcard[];
}