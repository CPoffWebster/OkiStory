import { Transaction, Sequelize } from 'sequelize';
import { Characters, CharactersAttributes } from "./models/Characters";
import { Locations, LocationsAttributes } from "./models/Locations";

export const seedDefaultCharacters = async (transaction: Transaction) => {
    for (const char of defaultCharacters) {
        const existingChar = await Characters.findOne({
            where: {
                GUID: char.GUID
            },
            transaction
        });

        if (!existingChar) {
            await Characters.create(char, { transaction });
        }
    }
};

export const seedDefaultLocations = async (transaction: Transaction) => {
    for (const loc of defaultLocations) {
        const existingLoc = await Locations.findOne({
            where: {
                GUID: loc.GUID
            },
            transaction
        });

        if (!existingLoc) {
            await Locations.create(loc, { transaction });
        }
    }
};


// Illustration of a [_____] for children\'s books. 

const defaultCharacters: CharactersAttributes[] = [
    {
        GUID: 'bcf97e61-589f-45b0-8a4b-560fdbbdebc0',
        Name: 'Teddy Bear',
        Description: 'Teddy Bear',
        GenerationDescription: 'The teddy bear has soft brown fur, big round eyes, and a stitched smile. It wears a red bowtie and has a cute, friendly demeanor.',
        GCSLocation: 'default/default_teddybear.png',
        IsDefault: true
    },
    {
        GUID: 'bd8fbfb2-0248-4cb9-b5e8-31f3fe4028af',
        Name: 'Racoon',
        Description: 'Racoon',
        GenerationDescription: 'The raccoon is mischievous yet endearing, with its signature black mask around its eyes, a bushy tail with dark stripes, and a curious expression on its face.',
        GCSLocation: 'default/default_racoon.png',
        IsDefault: true
    },
    {
        GUID: 'd7acfd01-892e-431d-a0f1-96c4744c31c6',
        Name: 'Pink Pig',
        Description: 'Pink Pig',
        GenerationDescription: 'The pig is plump and rosy pink, with a curly tail, large floppy ears, and a joyful expression.',
        GCSLocation: 'default/default_pig.png',
        IsDefault: true
    },
    // ...more characters
];

const defaultLocations: LocationsAttributes[] = [
    {
        GUID: 'e80f34d5-5271-463f-9d41-7aa41d206175',
        Name: 'Grassland',
        Description: 'Grassland',
        GenerationDescription: 'The scene captures a serene evening in the grasslands. Golden grass sways with the breeze, and animals sometimes in the distance with a setting sun behind them.',
        GCSLocation: 'default/default_grassland.png',
        IsDefault: true
    },
    {
        GUID: '4eb339a0-3478-43b6-9823-b8788844f809',
        Name: 'Forest',
        Description: 'Forest',
        GenerationDescription: 'The forest is dense with a variety of trees, some with leaves changing colors to signify autumn. A stream flows gently, reflecting the trees and the clear blue sky.',
        GCSLocation: 'default/default_forest.png',
        IsDefault: true
    },
    {
        GUID: '7133c535-39bd-4a8d-aa4d-c4c5863418c1',
        Name: 'Dessert',
        Description: 'Dessert',
        GenerationDescription: 'The desert landscape showcases tall sand dunes. There\'s an oasis with palm trees and a pond, providing a hint of life in the vast expanse.',
        GCSLocation: 'default/default_dessert.png',
        IsDefault: true
    }
    // ...more locations
];