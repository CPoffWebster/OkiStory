import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuthAdmin } from '@/utils/withAuthAdmin';
import { getStorage } from '@/services/storage';
import { defaultCharacters, defaultLocations } from '@/services/database/seedInstaller';
import { CharactersAttributes } from '@/services/database/models/Characters';
import { Locations, LocationsAttributes } from '@/services/database/models/Locations';
import { compressImage } from '@/services/imageCompression';

/**
 * Run through all of the default characters and location images and compress them 
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info('Starting admin/compressDefaultImages API Route');
    try {
        const characters: CharactersAttributes[] = defaultCharacters;
        const locations: LocationsAttributes[] = defaultLocations;

        const storage = getStorage();
        const characterBucket = process.env.CHARACTERS_GCS_BUCKET;
        const locationBucket = process.env.LOCATIONS_GCS_BUCKET;
        const characterStorage = storage.getBucket(characterBucket!);
        const locationStorage = storage.getBucket(locationBucket!);

        for (let i = 0; i < characters.length; i++) {
            const location = `gs://${characterBucket}/${characters[i].GCSLocation}`;
            const readStream = await storage.getReadStream(location);

            if (!readStream) {
                throw new Error('Unable to get image');
            }
            console.info('Compressing', characters[i].GCSLocation)
            const compressedImage = await compressImage(readStream);
            await characterStorage.upload(characters[i].GCSLocation!, compressedImage);
        }

        for (let i = 0; i < locations.length; i++) {
            const location = `gs://${locationBucket}/${locations[i].GCSLocation}`;
            const readStream = await storage.getReadStream(location);

            if (!readStream) {
                throw new Error('Unable to get image');
            }
            console.info('Compressing', locations[i].GCSLocation)
            const compressedImage = await compressImage(readStream);
            await locationStorage.upload(`${locations[i].GCSLocation!}`, compressedImage);
        }


        res.status(200).json({ message: 'Done' });
    } catch (error) {
        res.status(500).json({ message: `Unable to compressDefaultImages; Error: ${error}` });
    }
}

export default withAuthAdmin(handler);