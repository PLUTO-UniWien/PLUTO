import {NextApiRequest, NextApiResponse} from "next";
import auth from "basic-auth";


function getAllowedCredentials() {
    // Format: username1:password1|username2:password2...
    const authConfig = process.env.BASIC_AUTH_CREDENTIALS;
    const credentials = authConfig.split('|');
    return credentials.map((credential) => {
        const [username, password] = credential.split(':');
        return { username, password };
    });
}

export function requireBasicAuth(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const allowedCredentials = getAllowedCredentials();
    const user = auth(req);
    const isAuthorized = allowedCredentials.some((credential) => {
        return credential.username === user?.name && credential.password === user?.pass;
    });
    if (!isAuthorized) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
        res.status(401).json({message: 'Unauthorized'})
        return false;
    }
    return true;
}