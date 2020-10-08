import AuthService from '../auth/auth.js';
import MessengerError from "../errors/MessengerError.js";
import NoAuthDataProvidedError from "../errors/AuthError/NoAuthDataProvidedError.js";
import checkSignUpData from "../middlewares/checkSignUpData.js";

export default (app) => {
    app.post('/login', async (req, res) => {
        try {
            if (!req.body || !req.body.user || !req.body.user.email || !req.body.user.password) {
                throw new NoAuthDataProvidedError()
            }

            const email = req.body.user.email;
            const password = req.body.user.password;
            const authService = new AuthService();
            const { user, token } = await authService.Login(email, password);

            const cookieMaxAge = parseFloat(global.appConfig.cookie.maxAge) * 3600000 || 24 * 3600000;
            res.cookie('auth',token,{maxAge:cookieMaxAge, httpOnly:true, secure: false})
            const __dirname = process.cwd();
            res.sendFile('src/index.html', {root: __dirname })
            return res.status(200).send("Login successful").end();
        } catch(e) {
            const {code, json} = MessengerError.PrepareResponse(e);
            return res.status(code).json(json).end();
        }
    })

    app.post('/signup', checkSignUpData, async (req, res) => {
        try {
            const { tag, firstName, lastName, email, password } = req.body.user;
            const authService = new AuthService();
            const { user, token } = await authService.SignUp(tag, firstName, lastName, email, password);

            res.cookie('auth',token,{maxAge:900000, httpOnly:true, secure: false})
            return res.status(200).send("Sign up successful").end();
        } catch (e) {
            const {code, json} = MessengerError.PrepareResponse(e);
            return res.status(code).json(json).end();
        }
    })
};