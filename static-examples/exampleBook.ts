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
// export const generatedTextStory = {
//     "title": "The Adventure of Teddy Bear",
//     "titleImageDescription": "A colorful illustration of a teddy bear holding a small backpack, standing against a background of tall green trees in a forest.",
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
export const generatedTextStory = "{\"title\":\"Penny's Desert Adventure\",\"titleImageDescription\":\"The title 'Penny's Desert Adventure' is written in big, colorful letters with a picture of a pink pig exploring the desert landscape in the background.\",\"pageCount\":7,\"pages\":[{\"pageNumber\":1,\"text\":\"Once upon a time, in a faraway land, there lived a plump and rosy pink pig named Penny. Penny loved to explore and go on adventures.\",\"imageDescription\":\"A picture of Penny, the pink pig, standing in front of her cozy pink pig house in a grassy area, with a map in her hoof and a backpack on her back.\"},{\"pageNumber\":2,\"text\":\"One sunny morning, Penny decided to embark on a grand adventure. She packed her favorite snacks, a magnifying glass, and her trusty compass. Her curiosity led her to the vast desert.\",\"imageDescription\":\"A picture of Penny wearing her backpack and holding a magnifying glass, walking towards the sandy desert with tall dunes in the background. The sun is shining brightly in the sky.\"},{\"pageNumber\":3,\"text\":\"As Penny ventured deeper into the desert, she discovered tall sand dunes that shimmered like golden mountains. She climbed to the top of one and gasped in awe at the breathtaking view.\",\"imageDescription\":\"A picture of Penny standing on top of a tall sand dune, looking out at the vast desert landscape with a wide-eyed expression of wonder on her face. The sun is setting, casting a warm glow on the scene.\"},{\"pageNumber\":4,\"text\":\"In the distance, Penny spotted an oasis with palm trees and a sparkling pond. Excitedly, she ran towards it, imagining all the hidden treasures she might find.\",\"imageDescription\":\"A picture of Penny running towards the oasis, with palm trees swaying in the breeze and a sparkling pond reflecting the blue sky. She has a big smile on her face, full of anticipation.\"},{\"pageNumber\":5,\"text\":\"At the oasis, Penny discovered a secret cave hidden behind a waterfall. She tiptoed inside and found a treasure chest filled with shiny jewels and sparkling gems.\",\"imageDescription\":\"A picture of Penny peering into the cave entrance, surrounded by lush greenery. The waterfall is cascading down, revealing a glimpse of the treasure chest inside the cave.\"},{\"pageNumber\":6,\"text\":\"With her heart filled with excitement, Penny carefully opened the treasure chest. She gasped as the dazzling treasures shone brightly, reflecting colorful rays of light all around her.\",\"imageDescription\":\"A picture of Penny sitting next to the treasure chest, her eyes wide with astonishment as she gazes at the shining jewels. The cave is illuminated with a magical glow.\"},{\"pageNumber\":7,\"text\":\"Penny knew that her desert adventure had been a success. She decided to share her treasures with the desert creatures and make new friends. Together, they celebrated a day filled with discovery, friendship, and endless adventure.\",\"imageDescription\":\"A picture of Penny surrounded by the desert creatures, sitting on a picnic blanket and sharing the treasures with them. They are all smiling, laughing, and enjoying each other's company under a starry night sky.\"}],\"prompt\":\"You are a seasoned writer specializing in children's books that captivate young minds and hearts.\\n    Your stories are not only engaging but also memorable, staying with children for a lifetime.\\n    You have a unique talent for describing art in picture books in such a way that an AI could easily generate those images.\\n    \\n    Please create a children's storybook aimed at children aged 5.\\n    The story should be simple, utilizing basic action words and straightforward descriptions.\\n    The narrative should be structured in a way that makes it easy to create matching images.\\n    \\n    The narrative should be well-structured with a distinct beginning, middle, and end, avoiding any cliffhangers or abrupt stops.\\n    Each page, inclusive of the title page, should come with an accompanying image description.\\n    These descriptions should be crafted to suit hand-drawn, simple designs appropriate for picture books.\\n    Consistency is key: ensure that the characters and settings maintain a uniform style throughout the story, both in textual description and in the envisioned artwork.\\n    \\n    \\n    The output should strictly follow this structure with no new lines, additional text, or forward slashes:\\n    { \\\"title\\\": string, \\\"titleImageDescription\\\": string, \\\"pageCount\\\": number, \\\"pages\\\": [ { \\\"pageNumber\\\": number, \\\"text\\\": string, \\\"imageDescription\\\": string } ] }\\n    \\n    Important!: pageCount value should be between 5-10. There should be x pages in the pages list where x is equal to pageCount.\\n    \\n    Given the directions above, create a story with the following parameters:\\n    Character: Pink Pig (Description: The pig is plump and rosy pink, with a curly tail, large floppy ears, and a joyful expression.)\\n    Setting: Desert (Description: The desert landscape showcases tall sand dunes. There's an oasis with palm trees and a pond, providing a hint of life in the vast expanse.)\\n    Theme: Discovery and Adventure (Description: Tales of exploration, whether it's discovering a new world, going on a treasure hunt, or learning about the wonders of the universe.)\\n    \"}"

export const generatedImage = {
    created: 1696208997,
    data: [
        {
            url: 'https://placebear.com/300/300'
        }
    ]
}