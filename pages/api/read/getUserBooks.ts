import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { connectToDb } from '@/services/database/database';
import { getBooks } from '@/services/books';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('read/getBook API Route Triggered');

    const { userEmail, count, offset } = req.body;

    try {
        connectToDb();
        const books = await getBooks(userEmail, count, offset);
        res.status(200).json({ bookList: books });
    } catch (err) {
        res.status(500).json({ error: err });
    }

};

export default withAuth(handler);