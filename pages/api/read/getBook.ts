import type { NextApiRequest, NextApiResponse } from 'next';
import { getBookByGUID } from '@/services/books';
import { withBaseURL } from '@/utils/withBaseURL';
import { Users } from '@/services/database/models/Users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { guid } = req.body;
    console.info(`read/getBook API Route Triggered; guid: ${guid}`);
    const user = await Users.getUserBySession(req, res);

    try {
        const [book, pages, location, character] = await getBookByGUID(guid, user);
        res.status(200).json({ book, pages, location, character });
    } catch (err) {
        console.error(`Error in api/read/getBook; guid: ${guid}, err: ${JSON.stringify(err)}`);
        res.status(500).json({ error: err });
    }

};

export default withBaseURL(handler);