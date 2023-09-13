import { BooksAttributes } from "@/services/database/models/Books";
import { PagesAttributes } from "@/services/database/models/Pages";

export const exampleBook: BooksAttributes = {
    id: 1,
    Title: "The Bear in the Forest",
    CoverImage: "https://placebear.com/300/300",
    LocationID: 1,
    CharacterID: 1,
    UserID: 1,
}

export const examplePages: PagesAttributes[] = [
    {
        id: 1,
        BookID: 1,
        PageNumber: 1,
        Text: "Once upon a time, there was a bear in a forest.",
        Image: "https://placebear.com/300/300",
        PositiveImagePrompt: "",
        NegativeImagePrompt: ""
    },
    {
        id: 2,
        BookID: 1,
        PageNumber: 2,
        Text: "The bear lived in a cave.",
        Image: "https://placebear.com/300/300",
        PositiveImagePrompt: "",
        NegativeImagePrompt: ""
    },
    {
        id: 3,
        BookID: 1,
        PageNumber: 3,
        Text: "The bear ate berries and honey.",
        Image: "https://placebear.com/300/300",
        PositiveImagePrompt: "",
        NegativeImagePrompt: ""
    },
    {
        id: 4,
        BookID: 1,
        PageNumber: 4,
        Text: "The bear was happy.",
        Image: "https://placebear.com/300/300",
        PositiveImagePrompt: "",
        NegativeImagePrompt: ""
    },
]