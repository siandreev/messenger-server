import UserModel from '../model/model.js';
import NoAuthJWTError from "../errors/AuthError/NoAuthJWTError.js";
import MessengerError from "../errors/MessengerError.js";
import AuthError from "../errors/AuthError/AuthError.js";

export default async (req, ws, next) => {
    try {
        if (!req.token) {
            throw new NoAuthJWTError();
        }
        const decodedUser = req.token.data;
        const user = await UserModel.findOne({ _id: decodedUser._id });
        if (!user) {
            throw new AuthError();
        }
        req.currentUser = user;
        return next();
    } catch(e) {
        const {code, json} = MessengerError.PrepareResponse(e);
        ws.close(1000, JSON.stringify(json));
    }
}