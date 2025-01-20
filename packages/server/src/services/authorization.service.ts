import jwt from 'jsonwebtoken';
import CipherService, { EHashAlgorithm } from './Cipher.service';
import md5 from 'md5';

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
	console.log('token: ', token);
	const HashKey = jwtHash(key);
	return jwt.verify(token, HashKey);
};

export const getTokenData = (
	id: number,
	key: string,
	genRefreshToken?: boolean,
	expire?: number,
): { token: string; refreshToken?: string } => {
	const genToken = (data: any, key: string, expire: number): string =>
		jwt.sign({ data }, jwtHash(key), { expiresIn: expire });
	return {
		token: genToken({ id, type: 1 }, key, expire ? expire * 60 : 600),
		refreshToken: genRefreshToken
			? genToken({ id, type: 2 }, key, 3600 * 24 * 5)
			: undefined,
	};
};
