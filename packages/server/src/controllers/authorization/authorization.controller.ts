import md5 from 'md5';
import { UsuarioLoginPrismaRepository } from '../../repositories/usuario/Usuario.Login.repository';
import { UsuarioMePrismaRepository } from '../../repositories/usuario/Usuario.Me.repository';
// import { Connection } from '../../repositories/_cnn';
import {
	getTokenData,
	tokenVerify,
} from '../../services/authorization.service';
import { ControllerBase } from '../_controller.base';

// Usuario Logado /////////////////////////////////
export interface ILoggedUser {
	id: number;
	// id_cliente: number
	// id_permissao: number,
}
export interface IPrismaLoggedUser {
	id: string;
	id_cliente: string;
	id_permissao: string;
}
// LOGIN //////////////////////////////////////////
// export interface ILoginResult {
//     id: number,
//     nome: string,
//     permissao: number,
//     cliente: {
//         id: number
//     }
// }

// export const LoginResultSchema = Joi.object({
//     id: Joi.number().required(),
//     nome: Joi.string().required(),
//     permissao: Joi.number().required(),
//     cliente: {
//         id: Joi.number().required(),
//     }
// });
////////////////////////////////////////////////

export class AuthorizationController extends ControllerBase {
	constructor(dbKey: string, user: IPrismaLoggedUser) {
		super('AuthorizationController', dbKey, user);
	}

	async Login({ email, password }: { email: string; password: string }) {
		try {
			const hash = md5(password);
			/*
				// Conexão via SQL
				const cnn = new Connection(this.dbKey);
				const user = await new UsuarioLoginRepository(cnn).Login(email, hash);
			*/

			// Conexão via Prisma
			const user = await new UsuarioLoginPrismaRepository().Login(email, hash);
			if (user) return { user, auth: getTokenData(user.id, this.dbKey, true) };
		} catch {
			console.log('ERROR: Login Error');
		}
		throw new Error('Access Denied');
	}

	async Me() {
		try {
			const cache = await this.Cache?.Get(
				`${this.dbKey}${this.getName()}me${this.user.id}`,
			);
			if (cache) {
				await this.Cache.Set(
					`${this.dbKey}${this.getName()}me${this.user.id}`,
					cache,
					120,
				);
				return cache;
			}
			/*
				Conexão via SQL
				// const cnn = new Connection(this.dbKey);
				// const user = await new UsuarioMeRepository(cnn).Me(this.user.id);
			*/

			// Conexão via JSON API
			// const user = await new UsuarioMeRESTRepository().Me(this.user.id);

			//Conexão via PRISMA
			const user = await new UsuarioMePrismaRepository().Me(
				String(this.user.id),
			);

			await this.Cache?.Set(
				`${this.dbKey}${this.getName()}me${this.user.id}`,
				user,
				120,
			);
			return user;
		} catch (err) {
			console.log(err);
		}
		throw new Error('Access Denied');
	}

	async RefreshToken(token: string, id_cliente?: number) {
		try {
			const response = tokenVerify(token, this.dbKey);
			if (response.data.type === 2) {
				// Permite troca de CLIENTE pelo usuário logado !!!IMPORTANTE!!! necessário implementar
				// Consulta no BD se o usuário possui acesso ao id_cliente solicitado antes de
				// implantar em produção
				return { auth: getTokenData(response.data.id, this.dbKey) };
			}
		} catch {}
		throw new Error('Access Denied');
	}

	async CreateApiToken(expire: number) {
		try {
			return {
				auth: getTokenData(
					0,
					this.dbKey,
					false,
					expire ? expire * 24 * 60 : 43200,
				),
			};
		} catch {}
		throw new Error('Access Denied');
	}
}
