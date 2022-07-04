import express from 'express';
import { AuthorizationController } from '../controllers/authorization/authorization.controller';
import { RoutesBase } from './_base.routes';

export class AuthorizationPublicRoutes extends RoutesBase {
	constructor(app: express.Application) {
		super(app, 'AuthorizationPublicRoutes');
	}

	configureRoutes() {
		this.app
			.route(`/login`)
			.post((req: express.Request, res: express.Response) =>
				new AuthorizationController(req._key, req._LoggedUser)
					.Login(req.body ? req.body : '')
					.then(result => res.status(200).json(result))
					.catch(error => {
						console.log('testando: ');
						res.status(400).json(error);
					}),
			);

		this.app
			.route(`/refresh`)
			.put((req: express.Request, res: express.Response) =>
				new AuthorizationController(req._key, req._LoggedUser)
					.RefreshToken(req.body.token, Number(req.query.id))
					.then(result => res.status(200).json(result))
					.catch(error => res.status(400).json(error)),
			);

		return this.app;
	}
}
