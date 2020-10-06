import jwt from 'express-jwt';
import NoAuthJWTError from "../errors/AuthError/NoAuthJWTError.js";

const getTokenFromHeader = (req) => {
    const auth = req.cookies ? req.cookies.auth : getAuthCookie(req);
    if (auth) {
        return auth;
    } else {
        throw new NoAuthJWTError();
    }
}

function getAuthCookie(req) {
    const rc = req.headers.cookie;
    let result;
    if (rc) {
        rc.split(';').forEach(( cookie ) => {
            const parts = cookie.split('=');
            if (parts.length === 2 && parts[0].trim() === 'auth') {
                result = parts[1];
            }
        });
    }
    return result;
}

export default jwt({
    secret: 'MySuP3R_z3kr3t.',
    algorithms: ['HS256'],
    userProperty: 'token',
    getToken: getTokenFromHeader
})