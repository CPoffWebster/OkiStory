import type { NextApiRequest, NextApiResponse } from 'next';
import { withBaseURL } from '@/utils/withBaseURL';
import { connectToDb } from '@/services/database/database';
import { Locations } from '@/services/database/models/Locations';
import { Characters } from '@/services/database/models/Characters';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { locationGUID, characterGUID } = req.body;
    console.info(`read/getCreationElements API Route Triggered; locationGUID: ${locationGUID}, characterGUID: ${characterGUID}`);

    const db = connectToDb();
    const transaction = await db.transaction();
    try {

        let location = await Locations.getLocation(locationGUID, transaction);
        let character = await Characters.getCharacter(characterGUID, transaction);
        await transaction.commit();

        res.status(200).json({ location, character });


    } catch (err) {
        console.error(`Error in api/read/getCreationElements API Route Triggered; locationGUID: ${locationGUID}, characterGUID: ${characterGUID}, err: ${JSON.stringify(err)}`);
        res.status(500).json({ error: err });
    }

};

export default withBaseURL(handler);