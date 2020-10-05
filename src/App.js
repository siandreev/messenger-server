import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import 'express-async-errors';

import routes from './routes/index.js';
import MessengerError from "./errors/MessengerError.js";

mongoose.connect("mongodb://localhost:27017/auth", { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => {console.log(err)});
mongoose.set('useCreateIndex', true);
const app = new express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', routes);

app.use(function(err, req, res, next) {
    const {code, json} = MessengerError.PrepareResponse(err);
    return res.status(code).json(json).end();
});

app.listen(8000, async () => {
    console.log("Server run on localhost:8000");
});