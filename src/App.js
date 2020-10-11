import './uploadConfig.js'

import Express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import 'express-async-errors';
import WebSocket from 'express-ws';
import getCurrentIp from "./libs/getCurrentIp.js";

import Routes from './routes/auth-routes.js';
import './routes/web-socket.js'
import MessengerError from "./errors/MessengerError.js";

mongoose.connect("mongodb://localhost:27017/auth", { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => {console.log(err)});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const app = new Express();

app.use(bodyParser.json());
app.use(cookieParser());
WebSocket(app);
Routes(app);

app.use(function(err, req, res, next) {
    const {code, json} = MessengerError.PrepareResponse(err);
    return res.status(code).json(json).end();
});

const appPort = global.appConfig.app.port || 8000;

app.listen(appPort, async () => {
    console.log(`Server run on ${appPort} port`);
    console.log(`See demo on http://${getCurrentIp()}:${appPort}`)
});


/*
 Just for demo
 */
app.get('/', (req, res) => {
    const __dirname = process.cwd();
    res.sendFile('src/index.html', {root: __dirname })
})