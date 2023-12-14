import { getStorage, okiStoryGCSBucket } from "@/services/storage";
import { withBaseURL } from "@/utils/withBaseURL";
import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const filename = req.query.filename as string;

    console.info(`getImage API Route Triggered: ${filename}`)

    try {
        const storage = getStorage();
        const stream = await storage.getReadStream(`gs://${okiStoryGCSBucket}/${filename}`);
        if (!stream) {
            res.status(500).end(`Error getting image. Filename: ${filename}`);
            return;
        }

        res.setHeader('Content-Type', 'image/jpeg')
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
        stream.pipe(res);
    } catch (err: any) {
        console.error('Error in api/images/getImage', err.toString());
        res.status(500).json({ err });
    }

}

export default withBaseURL(handler);