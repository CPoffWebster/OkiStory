import { CharactersAttributes } from "@/services/database/models/Characters";

export const exampleDefaultCharacters: CharactersAttributes[] = [
    {
        id: 1,
        GUID: '12345678905',
        Name: "Character 1",
        Image: "nba.jpg",
        Description: "Character 1",
        GenerationDescription: "",
        IsDefault: true
    },
    {
        id: 2,
        GUID: '123456789056',
        Name: "Character 2",
        Image: "nba.jpg",
        Description: "Character 2",
        GenerationDescription: "",
        IsDefault: true
    },
    {
        id: 3,
        GUID: '123456789057',
        Name: "Character 3",
        Image: "nba.jpg",
        Description: "Character 3",
        GenerationDescription: "",
        IsDefault: true
    },
    {
        id: 4,
        GUID: '123456789058',
        Name: "Character 4",
        Image: "nba.jpg",
        Description: "Character 4",
        GenerationDescription: "",
        IsDefault: true
    },
];