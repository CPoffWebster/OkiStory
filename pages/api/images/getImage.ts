import { connectToDb } from "@/services/database/database";
import { Characters } from "@/services/database/models/Characters";
import { ImageGenerations } from "@/services/database/models/ImageGenerations";
import { Locations } from "@/services/database/models/Locations";
import { booksBucket, charactersBucket, getStorage, locationsBucket } from "@/services/storage";
import { withBaseURL } from "@/utils/withBaseURL";
import { NextApiRequest, NextApiResponse } from "next";

async function fetchImageDetails(imageType: string, imageID: string) {
    switch (imageType) {
        case 'character':
            const character = await Characters.getCharacter(imageID);
            return character ? { bucket: charactersBucket, filename: character.GCSLocation } : null;
        case 'location':
            const location = await Locations.getLocation(imageID);
            return location ? { bucket: locationsBucket, filename: location.GCSLocation } : null;
        case 'book':
            const generation = await ImageGenerations.getGeneration(Number(imageID));
            return generation && generation.GCSLocation ? { bucket: booksBucket, filename: generation.GCSLocation } : null;
        default:
            return null;
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const imageID = req.query.imageID as string;
    const imageType = (req.query.imageType as string).toLowerCase();

    console.log(`/api/images/getImage API Route Triggered: ${imageID}, ${imageType}`);

    connectToDb();
    const imageDetails = await fetchImageDetails(imageType, imageID);

    if (!imageDetails) {
        res.status(404).end(`Image not found for type: ${imageType}, id: ${imageID}`);
        return;
    }

    const storage = getStorage();
    const stream = await storage.getReadStream(`gs://${imageDetails.bucket}/${imageDetails.filename}`);
    if (!stream) {
        res.status(500).end(`Error getting image. Filename: ${imageDetails.filename}; ImageType: ${imageType}`);
        return;
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    stream.pipe(res);
}

export default withBaseURL(handler);