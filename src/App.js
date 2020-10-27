import './uploadConfig.js'

import Express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import 'express-async-errors';
import EnableWebSocket from 'express-ws';
import getCurrentIp from "./libs/getCurrentIp.js";

import AuthRoutes from './routes/auth-routes.js';
import UploadImageRoute from './routes/file-uploader.js';
import ExitRoute from './routes/exit.js';
import CreateWebSocketServer from './routes/web-socket.js';
import MessengerError from "./errors/MessengerError.js";

mongoose.connect("mongodb://localhost:27017/auth", { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => {console.log(err)});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const app = new Express();
const __dirname = process.cwd();

app.use(bodyParser.json());
app.use(fileUpload({
    limits: {
        fileSize: 15 * 1024 * 1024
    },
    abortOnLimit: true
}));
app.use(cors({credentials: true, origin: global.appConfig.client.url}));
app.use(cookieParser());

EnableWebSocket(app);
AuthRoutes(app);
UploadImageRoute(app);
ExitRoute(app);
CreateWebSocketServer(app);

app.use(function(err, req, res, next) {
    const {code, json} = MessengerError.PrepareResponse(err);
    if (req.ws) {
        console.log("close");
        req.ws.close(1000, JSON.stringify(json));
        console.log("close2");
    }
    return res.status(code).json(json).end();
});

app.use('/img', Express.static(__dirname + '/public/img'));
app.use(Express.static(__dirname + '/public/build'));

const appPort = global.appConfig.app.port || 8000;

app.listen(appPort, async () => {
    console.log(`Server run on ${appPort} port`);
    console.log(`See demo on http://${getCurrentIp()}:${appPort}/example`)
});

/*
 Just for demo
 */
app.get('/example', (req, res) => {
    res.sendFile('src/index.html', {root: __dirname })
})