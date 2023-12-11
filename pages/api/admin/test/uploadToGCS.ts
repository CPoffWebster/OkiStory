import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import axios from 'axios';
import { getStorage, okiStoryGCSBucket } from '@/services/storage';
import { compressImage } from '@/services/imageCompression';
import { generatedImage } from '@/static-examples/exampleBook';
import { withAuthAdmin } from '@/utils/withAuthAdmin';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    console.log("STARTED: uploadToGCS");

    const image = generatedImage;

    const storage = getStorage();
    const imageBucket = storage.getBucket(okiStoryGCSBucket);

    // Download the image and convert it to a stream
    const response = await axios.get(image.data[0].url!, { responseType: 'arraybuffer' });
    const imageStream = Readable.from(Buffer.from(response.data, 'binary'));

    // Compress the image using sharp
    const compressedImage = await compressImage(imageStream);

    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
    const GCSLocation = `books/${formattedDate}/THISISATEST.png`;

    // console.log('Uploading', GCSLocation, 'to', booksBucket);
    await imageBucket.upload(GCSLocation, compressedImage);

    res.status(200).json({ data: "Done" });
};

export default withAuthAdmin(handler);