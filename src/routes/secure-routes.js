import extractToken from '../middlewares/extractToken.js';
import attachUser from '../middlewares/attachUser.js';
import MessengerError from "../errors/MessengerError.js";

export default (app) => {
    app.get('/', extractToken, attachUser, async (req, res) => {
        try {
            const user = req.currentUser;

            return res.json({tag: user.tag}).status(200);
        } catch (e) {
            const {code, json} = MessengerError.PrepareResponse(e);
            return res.status(code).json(json).end();
        }
    })
}