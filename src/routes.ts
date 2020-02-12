import express, { Application } from 'express';

import * as home from 'controllers/home';
import * as apiV1 from 'controllers/api/v1';

const attachApiV1Routes = (app: Application): void => {
    const apiV1RootPath = '/api/v1';
    const apiV1Router = express.Router();

    apiV1Router.get('/test', apiV1.test);

    app.use(apiV1RootPath, apiV1Router);
};

export const attachPublicRoutes = (app: Application): void => {
    app.get('/', home.sayHelloWorld);
};

export const attachProtectedRoutes = (app: Application): void => {
    attachApiV1Routes(app);
};