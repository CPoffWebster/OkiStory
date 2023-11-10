import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '@/services/database/database';
import { getDefaultBooks, getUserBooks, totalUserBooks } from '@/services/books';
import { Users } from '@/services/database/models/Users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('read/getBook API Route Triggered');

    const { apiKey, count, offset } = req.body;

    if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        connectToDb();
        const user = await Users.getUserBySession(req, res);
        let books;
        let total;
        if (user) {
            total = await totalUserBooks(user.id!);
            books = await getUserBooks(user.id!, count, offset);
        } else {
            total = 1;
            books = [await getDefaultBooks()];
        }
        res.status(200).json({ bookList: books, totalBooks: total });
    } catch (err) {
        res.status(500).json({ error: err });
    }

};