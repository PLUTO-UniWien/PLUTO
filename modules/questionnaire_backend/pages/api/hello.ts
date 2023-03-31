import {NextApiRequest, NextApiResponse} from "next";
import initCors from "@/modules/cors/cors.utils";

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await initCors(req, res);
    res.status(200).json({name: 'John Doe'})
}
