import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '@/services/database/database';
import { getBookByGUID, getPagesByBookId } from '@/services/books';
import { PagesAttributes } from '@/services/database/models/Pages';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('read/getBook API Route Triggered');

    const { apiKey, guid, includePages } = req.body;

    if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        connectToDb();
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