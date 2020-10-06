import routes from './routes.js';
import secureRoutes from './secure-routes.js';
import express from 'express';
import WebSocket from 'express-ws';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser())
WebSocket(app);

routes(app);
secureRoutes(app);

export default app;