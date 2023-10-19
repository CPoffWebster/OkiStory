import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { connectToDb } from '@/services/database/database';
import { getBookByGUID, getPagesByBookId } from '@/services/books';
import { PagesAttributes } from '@/services/database/models/Pages';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('read/getBook API Route Triggered');

    const { guid, includePages } = req.body;
    connectToDb();

    try {
        let pages: PagesAttributes[] | null = null;
        const book = await getBookByGUID(guid);
        if (book && includePages) {
            pages = await getPagesByBookId(book.id!);
        }
        res.status(200).json({ book: book, pages: pages });
    } catch (err) {
        res.status(500).json({ error: err });
    }

};

export default withAuth(handler);