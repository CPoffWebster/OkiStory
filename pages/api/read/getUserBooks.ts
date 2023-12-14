import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '@/services/database/database';
import { getDefaultBooks, getUserBooks } from '@/services/books';
import { Users } from '@/services/database/models/Users';
import { withBaseURL } from '@/utils/withBaseURL';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { count, offset } = req.body;
    console.info(`read/getUserBooks API Route Triggered; count: ${count}, offset: ${offset}`);

    try {
        connectToDb();
        const user = await Users.getUserBySession(req, res);
        let books;
        let total;
        if (user) {
            [total, books] = await getUserBooks(user.id!, count, offset);
        } else {
            [total, books] = await getDefaultBooks(count, offset);
        }
        res.status(200).json({ bookList: books, totalBooks: total });
    } catch (err) {
        console.error(`Error in api/read/getUserBooks; count: ${count}, offset: ${offset}, err: ${JSON.stringify(err)}`);
        res.status(500).json({ error: err });
    }

};

export default withBaseURL(handler);