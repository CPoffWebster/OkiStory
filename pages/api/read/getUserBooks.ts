import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { connectToDb } from '@/services/database/database';
import { getBooks, totalUserBooks } from '@/services/books';
import { Users } from '@/services/database/models/Users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('read/getBook API Route Triggered');

    const { count, offset } = req.body;

    try {
        connectToDb();
        const user = await Users.getUserBySession(req, res);
        const books = await getBooks(user.id!, count, offset);
        const total = await totalUserBooks(user.id!);
        res.status(200).json({ bookList: books, totalBooks: total });
    } catch (err) {
        res.status(500).json({ error: err });
    }

};

export default withAuth(handler);