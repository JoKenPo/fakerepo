import express from 'express';
import { RoutesBase } from './_base.routes';
import { AuthorizationController } from '../controllers/authorization/authorization.controller';
import { isAnyLevel, isMaster, isMasterOrReadOnlyOrNormal } from '../middlewares/authorization.middleware';

export class AuthorizationPrivateRoutes extends RoutesBase {

    constructor(app: express.Application) {
        super(app, 'AuthorizationPrivateRoutes');
    }

    configureRoutes() {

        this.app.route(`/me`)
            .get(isMasterOrReadOnlyOrNormal, (req: express.Request, res: express.Response) => new AuthorizationController(req._key, req._LoggedUser)
                .Me()
                .then(result => res.status(200).json(result))
                .catch(error => res.status(400).json(error)))

        this.app.route(`/genapitoken`)
            .get(isMasterOrReadOnlyOrNormal, (req: express.Request, res: express.Response) => new AuthorizationController(req._key, req._LoggedUser)
                .CreateApiToken(Number(req.query.expire))
                .then(result => res.status(200).json(result))
                .catch(error => res.status(400).json(error)))

        return this.app;
    }
}
