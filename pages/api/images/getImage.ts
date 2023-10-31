import { booksBucket, charactersBucket, getStorage, locationsBucket } from "@/services/storage";
import { withAuth } from "@/utils/withAuth";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const filename = req.query.filename as string;
    const imageType = req.query.imageType as string;

    console.log(`getImage API Route Triggered: ${filename}, ${imageType}`)

    let bucket = '';
    switch (imageType) {
        case 'character':
            bucket = charactersBucket;
            break;
        case 'Hero':
            bucket = charactersBucket;
            break;
        case 'location':
            bucket = locationsBucket;
            break;
        case 'Theme':
            bucket = locationsBucket;
            break;
        case 'book':
            bucket = booksBucket;
            break;
        default:
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
    stream.pipe(res);
}

export default withAuth(handler);