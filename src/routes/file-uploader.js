import extractToken from "../middlewares/extractToken.js";
import attachUser from "../middlewares/attachUser.js";
import generateRandomHex from "../libs/generateRandomHex.js";
import MessengerError from "../errors/MessengerError.js";

export default (app) => {
    app.post('/upload-image', extractToken, attachUser, async (req, res) => {
        try {
            const file = req.files.image;
            const extension = file.name.split('.').pop();
            const fileName = generateRandomHex() + '.' + extension;
            file.mv(process.cwd() + '/public/img/' + fileName, function(err) {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).json(`{"fileName": "${fileName}"}`);
            });
        } catch (e) {
            const {code, json} = MessengerError.PrepareResponse(e);
            return res.status(code).json(json).end();
        }
    })
}