import NextCors from "nextjs-cors";
import {NextApiRequest, NextApiResponse} from "next";

export default async function initCors<T>(
    req: NextApiRequest,
    res: NextApiResponse<T>
) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200,
    });
}
