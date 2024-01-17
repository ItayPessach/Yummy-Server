import { Express } from "express";
import bodyParser from "body-parser";
import { configRoutes } from './routes';
import { configSwagger } from './swagger';
export const configExpress = (app: Express) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    configRoutes(app);
    if (process.env.NODE_ENV === 'development') {
        configSwagger(app);
    }
};
