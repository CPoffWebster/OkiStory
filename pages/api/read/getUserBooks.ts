import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { connectToDb } from '@/services/database/database';
import { getBooks } from '@/services/books';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('read/getBook API Route Triggered');

    const { userID, count, offset } = req.body;
    connectToDb();

    try {
        const books = await getBooks(userID, count, offset);
        res.status(200).json({ bookList: books });
    } catch (err) {
        res.status(500).json({ error: err });
    }

};

export default withAuth(handler);