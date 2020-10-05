import jwt from 'express-jwt';
import NoAuthDataError from "../errors/AuthError/NoAuthDataError.js";

const getTokenFromHeader = (req) => {
    const auth = req.cookies.auth;
    if (auth) {
        return auth;
    } else {
        throw new NoAuthDataError();
    }
}

export default jwt({
    secret: 'MySuP3R_z3kr3t.',
    algorithms: ['HS256'],
    userProperty: 'token',
    getToken: getTokenFromHeader
})