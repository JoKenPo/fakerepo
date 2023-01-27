import express from 'express';
import md5 from 'md5';
import { tokenVerify } from '../services/authorization.service';
import { ExistsKey } from '../services/Secrets.service';

export function BasicAuth(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) {
	try {
		const auth: string = req.headers.basic as string;
		if (auth) {
			const user: string = auth.split(':')[0];
			const password: string = auth.split(':')[1];
			if (
				user === process.env.BASIC_USER &&
				password === process.env.BASIC_PASSWORD
			)
				return next();
		}
	} catch {}

	return res.status(403).json({ status: 403, message: 'Access Denied' });
}

export const SetKey = (data: string) => {
	if (
		data.toLocaleLowerCase() == 'localhost' &&
		process.env.NODE_ENV &&
		process.env.NODE_ENV.toLowerCase() === 'development'
	)
		data = 'localhost';
	const key = data.split('.');
	if (
		key[0] !== '' //&&
		// key[1] == "com" &&
		// key[2] == "br"
	)
		return key[0].trim().toLowerCase();
	throw new Error('Invalid Key');
};

export function SetOriginKey(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) {
	try {
		let key = req.headers.ke;
		if (process.env.NODE_ENV === 'development' && !key) key = 'localhost';
		if (key && key.toString() != '') {
			req._key = SetKey(key.toString());
			if (ExistsKey(req._key)) return next();
		}
	} catch {}

	return res.status(403).json({ status: 403, message: 'Access Denied' });
}

export function AuthorizationMiddleware(app) {
	app.use(
		async (
			req: express.Request,
			res: express.Response,
			next: express.NextFunction,
		) => {
			try {
				if (
					req.headers.authorization &&
					req.headers.authorization.startsWith('Bearer ')
				) {
					const result: any = tokenVerify(
						req.headers.authorization.split(' ')[1],
						req._key,
					);
					if (result.data.type === 1) {
						req._LoggedUser = {
							id: result.data.id,
							id_cliente: result.data.id_cliente,
							id_permissao: result.data.level,
						};
						return next();
					}
				}
			} catch (err) {}
			return res.status(401).json({ status: 401, message: 'Access Denied' });
		},
	);
}

export function isMaster(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) {
	// req._LoggedUser.id_permissao === 1
	//   ? next()
	//   : res.status(403).json({ status: 403, message: "Access Denied" });
	next();
}

export function isMasterOrNormal(req, res, next) {
	// req._LoggedUser.id_permissao === 1 || req._LoggedUser.id_permissao === 2
	//   ? next()
	//   : res.status(403).json({ status: 403, message: "Access Denied" });
	next();
}

export function isMasterOrReadOnlyOrNormal(req, res, next) {
	// req._LoggedUser.id_permissao === 1 ||
	// req._LoggedUser.id_permissao === 2 ||
	// req._LoggedUser.id_permissao === 3 ||
	// req._LoggedUser.id_permissao === 5 // API Token
	//   ? next()
	//   : res.status(403).json({ status: 403, message: "Access Denied" });
	next();
}

export function isMasterOrNormalOrEc(req, res, next) {
	// req._LoggedUser.permissao === 1 ||
	// req._LoggedUser.id_permissao === 2 ||
	// req._LoggedUser.id_permissao === 4
	//   ? next()
	//   : res.status(403).json({ status: 403, message: "Access Denied" });
	next();
}

export function isAnyLevel(req, res, next) {
	// req._LoggedUser.id_permissao > 0
	// ? next()
	// : res.status(403).json({ status: 403, message: "Access Denied" });
	next();
}
