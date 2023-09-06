import { Book } from "@/types/book";

export const exampleBook: Book = {
    location: "A forest",
    character: "A bear",
    created: true,
    generatedBook: {
        title: "The Bear in the Forest",
        cover: "https://placebear.com/300/300",
        pages: [
            {
                picture: "https://placebear.com/300/300",
                text: "Once upon a time, there was a bear in a forest.",
                pageNumber: 1
            },
            {
                picture: "https://placebear.com/300/300",
                text: "The bear lived in a cave.",
                pageNumber: 2
            },
            {
                picture: "https://placebear.com/300/300",
                text: "The bear ate berries and honey.",
                pageNumber: 3
            },
            {
                picture: "https://placebear.com/300/300",
                text: "The bear was happy.",
                pageNumber: 4
            }
        ]
    }
}