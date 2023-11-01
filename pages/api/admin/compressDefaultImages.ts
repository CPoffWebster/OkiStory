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
    console.log('Starting admin/compressDefaultImages API Route');
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
            console.log('Compressing', characters[i].GCSLocation)
            const compressedImage = await compressImage(readStream);
            await characterStorage.upload(characters[i].GCSLocation!, compressedImage);
        }
        
        for (let i = 0; i < locations.length; i++) {
            const location = `gs://${locationBucket}/${locations[i].GCSLocation}`;
            const readStream = await storage.getReadStream(location);
            
            if (!readStream) {
                throw new Error('Unable to get image');
            }
            console.log('Compressing', locations[i].GCSLocation)
            const compressedImage = await compressImage(readStream);
            await locationStorage.upload(`${locations[i].GCSLocation!}`, compressedImage);
        }

    
        res.status(200).json({ message: 'Done' });
    } catch (error) {
        res.status(500).json({ message: `Unable to compressDefaultImages; Error: ${error}` });
    }
}

export default withAuthAdmin(handler);


// import type { NextApiRequest, NextApiResponse } from 'next';
// import { withAuthAdmin } from '@/utils/withAuthAdmin';
// import { Readable } from 'stream';
// import sharp from 'sharp';
// import { getStorage } from '@/services/storage';

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//     console.log('Starting admin/newDefaultCharacter API Route');
//     try {
//         const { bucket, filename } = req.body;
//         const storage = getStorage();
//         const location = `gs://${bucket}/${filename}`;
//         const readStream = await storage.getReadStream(location);

//         if (!readStream) {
//             res.status(500).json({ message: 'Unable to get image' });
//             return;
//         }
        
//         /**
//          * Transform the image using sharp
//          * PNG is a lossless format, so defining the quality is not necessary
//          * 
//          * We could go one step forward and add lossy compression to the image to make it even smaller
//          * ex: const transformStream = sharp().png({ palette: true, colors: 256 });
//          */
//         const transformStream = sharp().png();
        
//         // Create an array to store the transformed image chunks
//         const chunks: any[] = [];
        
//         // Pipe the read stream through the transform stream
//         readStream.pipe(transformStream)
//         .on('data', (chunk) => {
//             chunks.push(chunk);
//         })
//         .on('end', async () => {
//             // Combine the chunks into a single buffer
//             const imageBuffer = Buffer.concat(chunks);
            
//             // Convert the buffer to a readable stream
//             const imageStream = Readable.from(imageBuffer);
            
//             // Upload the stream to Google Cloud Storage
//             const imageBucket = storage.getBucket(bucket);  // Replace with your actual method to get the bucket
//             await imageBucket.upload(filename, imageStream);

//             res.status(200).json({ message: 'Image compressed and uploaded successfully' });
//         });
//         // res.status(200).json({ message: 'Done' });
//     } catch (error) {
//         res.status(500).json({ message: 'Unable to upload newDefaultCharacter' });
//     }
// }

// export default withAuthAdmin(handler);


// // import { Readable } from 'stream';
// // import axios from 'axios';
// // import { v4 as uuidv4 } from 'uuid';
// // import { getStorage } from "@/services/storage";  // Replace with your actual import
// // import { ImageGenerationsAttributes } from './yourModel';  // Replace with your actual import

// // const booksBucket = 'your-books-bucket';  // Replace with your actual bucket name

// // async function updateGeneratedImageRecord(imageUrl: string) {
// //     const storage = getStorage();
// //     const imageBucket = storage.getBucket(booksBucket);

// //     // Download the image and convert it to a stream
// //     const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
// //     const imageBuffer = Buffer.from(response.data, 'binary');

// //     // Compress the image using sharp
// //     const compressedBuffer = await sharp(imageBuffer)
// //         .png({ quality: 80 })  // Adjust quality as needed
// //         .toBuffer();

// //     const imageStream = Readable.from(compressedBuffer);

// //     const filename = `default/default_${name}.png`;
// //     console.log('Uploading', filename, 'to', booksBucket);
    
// //     await imageBucket.upload(filename, imageStream);
// // }
