import { Characters } from "../database/models/Characters";

/**
 * Create a book prompt that is used to generate a book
 * @param characterID 
 * @param locationID 
 * @param themeID 
 * @returns book prompt string
 */
export async function bookPrompt(characterID: number, locationID: number, themeID: number): Promise<string> {
    const character = characters[0]; // await Characters.getCharacter(characterID);
    const location = settings[0]; // await Locations.getLocation(locationID);
    const themeName = themes[0].name;
    const themeDesc = themes[0].desc;

    return `
    You are a seasoned writer specializing in children's books that captivate young minds and hearts.
    Your stories are not only engaging but also memorable, staying with children for a lifetime.
    You have a unique talent for describing art in picture books in such a way that an AI could easily generate those images.
    
    
    Please create a children's storybook aimed at children aged ${childrenAge}.
    The story should be simple, utilizing basic action words and straightforward descriptions.
    The narrative should be structured in a way that makes it easy to create matching images.
    
    The narrative should be well-structured with a distinct beginning, middle, and end, avoiding any cliffhangers or abrupt stops.
    Each page, inclusive of the title page, should come with an accompanying image description.
    These descriptions should be crafted to suit hand-drawn, simple designs appropriate for picture books.
    Consistency is key: ensure that the characters and settings maintain a uniform style throughout the story, both in textual description and in the envisioned artwork.
    
    
    The output should strictly follow this structure:
    {
        "title": string,
        "titleImageDescription": string,
        "pageCount": number,
        "pages": [
            {
                "pageNumber": number,
                "text": string,
                "imageDescription": string
            }
        ]
    }
    
    Given the directions above, create a story with the following parameters:
    Character: ${character}
    Setting: ${location}
    ThemeName: ${themeName}}
    themeDesc: ${themeDesc}
    `;
}

export function imagePrompt(imageDescription: string, characterID: number, locationID: number, styleID: number): string {
    return `
        You are a seasoned artist specializing in children's book art that captivate young minds and hearts.
        Your art is not only engaging but also memorable, staying with children for a lifetime.
        
        Image Description: ${imageDescription}
        Character: ${characters[characterID]}
        Setting: ${settings[locationID]}
        Style: picture book drawing
    `;
}


const childrenAge = 5;

const characters = [
    "Teddy Bear",
    "Raccoon",
    "Pink Pig"
];

const settings = [
    "Forest",
    "Desert",
    "Grasslands"
];

const themes = [
    {
        name: "Discovery and Adventure",
        desc: "Tales of exploration, whether it's discovering a new world, going on a treasure hunt, or learning about the wonders of the universe."
    },
    {
        name: "Responsibility and Ethics",
        desc: "Stories that teach children about the importance of being responsible, making moral choices, and understanding the consequences of their actions, whether in everyday situations or grand adventures."
    },
    {
        name: "Problem-Solving and Critical Thinking",
        desc: "Stories where characters face puzzles, mysteries, or challenges that require logic, reasoning, and out-of-the-box solutions to resolve."
    },
    {
        name: "Acceptance and Self-Love",
        desc: "Narratives that highlight the importance of self-acceptance, understanding one's unique qualities, and realizing that everyone has a special place in the world."
    },
    {
        name: "Growth and Change",
        desc: "Narratives that follow characters as they grow, evolve, and navigate transitions, such as moving homes, growing older, or gaining a new sibling."
    },
    {
        name: "Empathy and Kindness",
        desc: "Stories that teach the importance of being kind, understanding different perspectives, and showing compassion to others, even if they seem different."
    },
    {
        name: "Understanding Emotions",
        desc: "Books that delve into feelings, helping children identify, understand, and express their emotions, from happiness and love to anger and sadness."
    },
    {
        name: "Family and Relationships",
        desc: "Stories focusing on family bonds, the joy of having siblings, or adjusting to a new family structure (like with blended families or adoption)."
    },
    {
        name: "Courage and Bravery",
        desc: "Narratives where characters face their fears, whether it's starting a new school, facing a bully, or venturing into an unknown place."
    },
    {
        name: "Friendship and Unity",
        desc: "Stories that emphasize the importance of friends and coming together to overcome challenges. They demonstrate how diverse groups can work together for a common cause."
    }
];