import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '@/services/database/database';
import { getBookByGUID, getPagesByBookId } from '@/services/books';
import { PagesAttributes } from '@/services/database/models/Pages';
import { withBaseURL } from '@/utils/withBaseURL';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('read/getBook API Route Triggered');

    const { guid, includePages } = req.body;

    try {
        connectToDb();
        let pages: PagesAttributes[] | null = null;
        const book = await getBookByGUID(guid);
        if (book && includePages) {
            pages = await getPagesByBookId(book.id!);
        }
        res.status(200).json({ book: book, pages: pages });
    } catch (err) {
        console.error('Error in api/read/getBook', err);
        res.status(500).json({ error: err });
    }

};

export default withBaseURL(handler);