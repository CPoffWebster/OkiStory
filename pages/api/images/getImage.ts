import { booksBucket, charactersBucket, getStorage, locationsBucket } from "@/services/storage";
import { withBaseURL } from "@/utils/withBaseURL";
import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const filename = req.query.filename as string;
    const imageType = req.query.imageType as string;

    console.log(`getImage API Route Triggered: ${filename}, ${imageType}`)

    try {
        const bucketMap: Record<string, string> = {
            'character': charactersBucket,
            'location': locationsBucket,
            'book': booksBucket
        };
        const bucket = bucketMap[imageType.toLowerCase()];

        if (!bucket) {
            res.status(404).end();
            return;
        }

        const storage = getStorage();
        const stream = await storage.getReadStream(`gs://${bucket}/${filename}`);
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