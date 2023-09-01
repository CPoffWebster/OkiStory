export interface Book {
  setting: string;
  character: string;
}

export interface CharacterSelectionProps {
  sendCharacterInfo: (character: string) => void;
}

export interface SettingSelectionProps {
  sendSettingInfo: (setting: string) => void;
}

export interface BookCreationProps {
  sendBookInfo: (book: Book) => void;
}
