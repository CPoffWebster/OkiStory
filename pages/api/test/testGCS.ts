// import { charactersBucket, getStorage } from '../../../services/storage';
// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     console.log('testGCS API Route Triggered');
//     const storage = getStorage();

//     const filename = 'nba.jpg';

//     const stream = await storage.getReadStream(`gs://${charactersBucket}/${filename}`);
//     if (!stream) {
//         throw new Error('No record found');
//     }

//     // res.status(200).json({ message: 'Hello from test API', stream: stream });
//     res.setHeader('Content-Type', 'image/jpeg')
//     stream.pipe(res);
// }
