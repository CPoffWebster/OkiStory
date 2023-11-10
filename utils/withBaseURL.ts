import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

// Define the allowed base URL
const allowedBaseURL = process.env.ALLOWED_BASE_URL;

export const withBaseURL = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Construct the request's base URL from the Host header
        const requestBaseURL = `${req.headers.host}`;

        // Check if the request's base URL matches the allowed base URL
        if (requestBaseURL !== allowedBaseURL) {
            res.status(403).json({ error: "Forbidden: Request from unauthorized URL" });
            return;
        }

        // If the base URL is valid, proceed with the original handler
        return handler(req, res);
    } catch (error) {
        console.error('Base URL validation error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};