import { BooksAttributes } from "@/services/database/models/Books";
import { PagesAttributes } from "@/services/database/models/Pages";

export const exampleBook: BooksAttributes = {
    id: 1,
    GUID: '1234567890',
    Title: "The Bear in the Forest",
    GeneratedImageID: 1,
    GeneratedTextID: 1,
    LocationID: 1,
    CharacterID: 1,
    ThemeID: 0,
    PageCount: 4,
    UserID: 1,
}

export const examplePages: PagesAttributes[] = [
    {
        id: 1,
        BookID: 1,
        PageNumber: 1,
        Text: "Once upon a time, there was a bear in a forest.",
        GeneratedImageID: 1
    },
    {
        id: 2,
        BookID: 1,
        PageNumber: 2,
        Text: "The bear lived in a cave.",
        GeneratedImageID: 1
    },
    {
        id: 3,
        BookID: 1,
        PageNumber: 3,
        Text: "The bear ate berries and honey.",
        GeneratedImageID: 1
    },
    {
        id: 4,
        BookID: 1,
        PageNumber: 4,
        Text: "The bear was happy.",
        GeneratedImageID: 1
    },
]


// export const generatedTextStory = {
//     "title": "sssss",
//     "titleImageDescription": "aaaaa",
//     "pageCount": 3,
//     "pages": [
//         {
//             "pageNumber": 1,
//             "text": "sssss",
//             "imageDescription": "aaaaa"
//         },
//         {
//             "pageNumber": 2,
//             "text": "sssss",
//             "imageDescription": "aaaaa"
//         },
//         {
//             "pageNumber": 3,
//             "text": "sssss",
//             "imageDescription": "aaaaa"
//         }
//     ]
// }
// export const generatedTextStory = {
//     "pageCount": 3,
//     "pages": [
//         {
//             "pageNumber": 1,
//             "text": "Once upon a time, in a magical forest, there lived a kind and gentle Teddy Bear named Teddy. Teddy loved to explore and learn new things.",
//             "imageDescription": "A cute illustration of Teddy Bear with a smile on its face, standing in front of a beautiful forest filled with vibrant green trees and colorful flowers."
//         },
//         {
//             "pageNumber": 2,
//             "text": "One sunny day, while walking through the forest, Teddy saw a little bunny caught in a thorny bush. The bunny was scared and needed help.",
//             "imageDescription": "An adorable illustration of Teddy Bear reaching out to grab hold of the thorny bush, while the frightened bunny looks up at Teddy with big, pleading eyes."
//         },
//         {
//             "pageNumber": 3,
//             "text": "Teddy carefully untangled the bunny from the thorny bush, making sure not to hurt it. The bunny hopped away happily, thanking Teddy for saving it.",
//             "imageDescription": "A heartwarming illustration of Teddy Bear gently removing the thorny branches from the bunny's fur, with the bunny looking relieved and grateful."
//         }
//     ]
// }
export const generatedTextStory = {
    "title": "The Adventure of Teddy Bear",
    "titleImageDescription": "A colorful illustration of a teddy bear holding a small backpack, standing against a background of tall green trees in a forest.",
    "pageCount": 3,
    "pages": [
        {
            "pageNumber": 1,
            "text": "Once upon a time, in a magical forest, there lived a kind and gentle Teddy Bear named Teddy. Teddy loved to explore and learn new things.",
            "imageDescription": "A cute illustration of Teddy Bear with a smile on its face, standing in front of a beautiful forest filled with vibrant green trees and colorful flowers."
        },
        {
            "pageNumber": 2,
            "text": "One sunny day, while walking through the forest, Teddy saw a little bunny caught in a thorny bush. The bunny was scared and needed help.",
            "imageDescription": "An adorable illustration of Teddy Bear reaching out to grab hold of the thorny bush, while the frightened bunny looks up at Teddy with big, pleading eyes."
        },
        {
            "pageNumber": 3,
            "text": "Teddy carefully untangled the bunny from the thorny bush, making sure not to hurt it. The bunny hopped away happily, thanking Teddy for saving it.",
            "imageDescription": "A heartwarming illustration of Teddy Bear gently removing the thorny branches from the bunny's fur, with the bunny looking relieved and grateful."
        }
    ]
}
// export const generatedTextStory = {
//     "title": "The Adventure of Teddy Bear",
//     "titleImageDescription": "A colorful illustration of a teddy bear holding a small backpack, standing against a background of tall green trees in a forest.",
//     "pageCount": 10,
//     "pages": [
//         {
//             "pageNumber": 1,
//             "text": "Once upon a time, in a magical forest, there lived a kind and gentle Teddy Bear named Teddy. Teddy loved to explore and learn new things.",
//             "imageDescription": "A cute illustration of Teddy Bear with a smile on its face, standing in front of a beautiful forest filled with vibrant green trees and colorful flowers."
//         },
//         {
//             "pageNumber": 2,
//             "text": "One sunny day, while walking through the forest, Teddy saw a little bunny caught in a thorny bush. The bunny was scared and needed help.",
//             "imageDescription": "An adorable illustration of Teddy Bear reaching out to grab hold of the thorny bush, while the frightened bunny looks up at Teddy with big, pleading eyes."
//         },
//         {
//             "pageNumber": 3,
//             "text": "Teddy carefully untangled the bunny from the thorny bush, making sure not to hurt it. The bunny hopped away happily, thanking Teddy for saving it.",
//             "imageDescription": "A heartwarming illustration of Teddy Bear gently removing the thorny branches from the bunny's fur, with the bunny looking relieved and grateful."
//         },
//         {
//             "pageNumber": 4,
//             "text": "As Teddy continued his adventure, he noticed a litter of empty soda cans lying on the forest floor. He knew it wasn't right to leave them there, so he decided to clean up.",
//             "imageDescription": "A delightful illustration of Teddy Bear bending down to pick up the empty soda cans scattered on the ground, with a determined expression on its face."
//         },
//         {
//             "pageNumber": 5,
//             "text": "Teddy filled his small backpack with the soda cans, understanding the importance of keeping the forest clean and protecting nature.",
//             "imageDescription": "A charming illustration of Teddy Bear wearing a small backpack and carefully placing the cleaned soda cans inside, demonstrating responsibility for the environment."
//         },
//         {
//             "pageNumber": 6,
//             "text": "For the rest of the day, Teddy walked through the forest, picking up litter and keeping the beautiful place clean. Other animals watched and started helping too.",
//             "imageDescription": "An enchanting illustration of Teddy Bear walking through the forest, collecting more litter, with various animals happily joining in the clean-up effort."
//         },
//         {
//             "pageNumber": 7,
//             "text": "By the time the sun began to set, the forest was sparkling clean, thanks to Teddy's efforts. The animals thanked Teddy for being a responsible guardian of their home.",
//             "imageDescription": "A captivating illustration of a clean and pristine forest at sunset, with Teddy Bear standing tall among the animals, all looking happy and proud of their tidy surroundings."
//         },
//         {
//             "pageNumber": 8,
//             "text": "As Teddy made his way back home, he was filled with joy and a sense of accomplishment. He realized that even small actions can make a big difference.",
//             "imageDescription": "A heartening illustration of Teddy Bear walking happily towards its home, with a smiling face and a backpack filled with the cleaned soda cans."
//         },
//         {
//             "pageNumber": 9,
//             "text": "From that day on, Teddy always carried a small bag with him during his adventures, ready to lend a helping hand and be a responsible friend to the forest animals.",
//             "imageDescription": "A touching illustration of Teddy Bear wearing a backpack on every adventure, with a warm smile and animals of the forest gathered around it, showing gratitude and friendship."
//         },
//         {
//             "pageNumber": 10,
//             "text": "And so, Teddy Bear's adventures continued, teaching everyone the importance of responsibility, ethics, and making good choices.",
//             "imageDescription": "A delightful illustration of Teddy Bear standing proudly in the forest, with its paw outstretched, as if inviting others to join in on the wonderful adventures that await."
//         }
//     ]
// }

export const generatedImage = {
    created: 1696208997,
    data: [
        {
            url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-RISWxyNpKXIW2Rq6pM5wQBUA/user-7YXHnRuMfPhcuHLB47XtCEW7/img-ZXQH3COF7hJwxz5GVmAkCSwh.png?st=2023-10-02T00%3A09%3A57Z&se=2023-10-02T02%3A09%3A57Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-02T00%3A18%3A46Z&ske=2023-10-03T00%3A18%3A46Z&sks=b&skv=2021-08-06&sig=2ts1n0s/jiRUdvjJQzKIqKnPwUFSjtRkgmFrFGX1Rnc%3D'
        }
    ]
}