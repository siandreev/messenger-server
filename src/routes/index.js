import routes from './routes.js';
import secureRoutes from './secure-routes.js';
import express from 'express';

const app = express();

routes(app);
secureRoutes(app);

export default app;