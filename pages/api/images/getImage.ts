import { getStorage, okiStoryGCSBucket } from "@/services/storage";
import { withBaseURL } from "@/utils/withBaseURL";
import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const filename = req.query.filename as string;
    const imageType = req.query.imageType as string;

    console.log(`getImage API Route Triggered: ${filename}, ${imageType}`)

    try {
        const bucketMap: Record<string, string> = {
            'character': 'characters/',
            'location': 'locations/',
            'book': 'books/'
        };
        let GCSLocation = bucketMap[imageType.toLowerCase()];
        // Introduced a bug when updating GCS bucket to OKI_STORY_GCS_BUCKET=okistory-dev
        // This removes the bucket name from the filename for new images
        if (filename.startsWith(GCSLocation)) {
            GCSLocation = '';
        }

        const storage = getStorage();
        console.log(`gs://${okiStoryGCSBucket}/${GCSLocation}${filename}`)
        const stream = await storage.getReadStream(`gs://${okiStoryGCSBucket}/${GCSLocation}${filename}`);
        if (!stream) {
            res.status(500).end(`Error getting image. Filename: ${filename}; ImageType: ${imageType}`);
            return;
        }

        res.setHeader('Content-Type', 'image/jpeg')
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
        stream.pipe(res);
    } catch (err) {
        console.error('Error in api/images/getImage', err);
        res.status(500).json({ err });
    }

}

export default withBaseURL(handler);