import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { connectToDb } from '@/services/database/database';
import { getBookByGUID } from '@/services/books';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('read/getBook API Route Triggered');

    const { guid } = req.body;
    connectToDb();

    try {
        const book = await getBookByGUID(guid);
        console.log('book here', book)
        res.status(200).json({ book: book });
    } catch (err) {
        res.status(500).json({ error: err });
    }

};

export default withAuth(handler);