import type { NextApiRequest, NextApiResponse } from 'next';
import { getBookByGUID } from '@/services/books';
import { withBaseURL } from '@/utils/withBaseURL';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { guid, includePages } = req.body;
    console.info(`read/getBook API Route Triggered; guid: ${guid}, includePages: ${includePages}`);

    try {
        const [book, pages] = await getBookByGUID(guid);
        res.status(200).json({ book: book, pages: pages });
    } catch (err: any) {
        console.error(`Error in api/read/getBook; guid: ${guid}, includePages: ${includePages}, err: ${JSON.stringify(err)}`);
        res.status(500).json({ error: err });
    }

};

export default withBaseURL(handler);