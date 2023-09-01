export interface Book {
  setting: string;
  character: string;
  created?: boolean;
  generatedBook?: {
    title: string;
    cover: string;
    pages: Pages[];
  };
}

export interface Pages {
  picture: string;
  text: string;
  pageNumber: number;
}
