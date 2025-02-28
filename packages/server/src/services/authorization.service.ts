import jwt from 'jsonwebtoken';
import CipherService, { EHashAlgorithm } from './Cipher.service';
import md5 from 'md5';
import { IPrismaLoggedUser } from '../controllers/authorization/authorization.controller';

const salt: string = (process.env.CIPHER_SALT || 'k#4!L$fgVj').substring(0, 10);
const jwt_pwd: string = (process.env.JWT_SECRET || '$F5u@y7*!a').substring(
	0,
	10,
);

const jwtHash = (key: string): string =>
	new CipherService().Hash(
		key,
		jwt_pwd + salt + md5(key).substring(0, 12),
		EHashAlgorithm.sha256,
	);

export const tokenVerify = (token: string, key: string): any => {
	const HashKey = jwtHash(key);
	return jwt.verify(token, HashKey);
};

export const getTokenData = (
	user: IPrismaLoggedUser,
	key: string,
	genRefreshToken?: boolean,
	expire?: number,
): { token: string; refreshToken?: string } => {
	const genToken = (data: any, key: string, expire: number): string =>
		jwt.sign({ data }, jwtHash(key), { expiresIn: expire });
	return {
		token: genToken(
			{
				id: user.id,
				id_cliente: user.id_cliente,
				id_permissao: user.id_permissao,
				type: 1,
			},
			key,
			expire ? expire * 60 : 600,
		),
		refreshToken: genRefreshToken
			? genToken(
					{
						id: user.id,
						id_cliente: user.id_cliente,
						id_permissao: user.id_permissao,
						type: 2,
					},
					key,
					3600 * 24 * 5,
				)
			: undefined,
	};
};
