import crypto from 'crypto';

const salt = process.env.CIPHER_SALT || '123';

const Right = (str, n) => {
	if (n <= 0) return '';
	else if (n > String(str).length) return str;
	else {
		const iLen = String(str).length;
		return String(str).substring(iLen, iLen - n);
	}
};

export enum EHashAlgorithm {
	'DSA' = 'DSA',
	'DSA-SHA' = 'DSA-SHA',
	'DSA-SHA1' = 'DSA-SHA1',
	'DSA-SHA1-old' = 'DSA-SHA1-old',
	'RSA-MD4' = 'RSA-MD4',
	'RSA-MD5' = 'RSA-MD5',
	'RSA-MDC2' = 'RSA-MDC2',
	'RSA-RIPEMD160' = 'RSA-RIPEMD160',
	'RSA-SHA' = 'RSA-SHA',
	'RSA-SHA1' = 'RSA-SHA1',
	'RSA-SHA1-2' = 'RSA-SHA1-2',
	'RSA-SHA224' = 'RSA-SHA224',
	'RSA-SHA256' = 'RSA-SHA256',
	'RSA-SHA384' = 'RSA-SHA384',
	'RSA-SHA512' = 'RSA-SHA512',
	'dsaEncryption' = 'dsaEncryption',
	'dsaWithSHA' = 'dsaWithSHA',
	'dsaWithSHA1' = 'dsaWithSHA1',
	'dss1' = 'dss1',
	'ecdsa-with-SHA1' = 'ecdsa-with-SHA1',
	'md4' = 'md4',
	'md4WithRSAEncryption' = 'md4WithRSAEncryption',
	'md5' = 'md5',
	'md5WithRSAEncryption' = 'md5WithRSAEncryption',
	'mdc2' = 'mdc2',
	'mdc2WithRSA' = 'mdc2WithRSA',
	'ripemd' = 'ripemd',
	'ripemd160' = 'ripemd160',
	'ripemd160WithRSA' = 'ripemd160WithRSA',
	'rmd160' = 'rmd160',
	'sha' = 'sha',
	'sha1' = 'sha1',
	'sha1WithRSAEncryption' = 'sha1WithRSAEncryption',
	'sha224' = 'sha224',
	'sha224WithRSAEncryption' = 'sha224WithRSAEncryption',
	'sha256' = 'sha256',
	'sha256WithRSAEncryption' = 'sha256WithRSAEncryption',
	'sha384' = 'sha384',
	'sha384WithRSAEncryption' = 'sha384WithRSAEncryption',
	'sha512' = 'sha512',
	'sha512WithRSAEncryption' = 'sha512WithRSAEncryption',
	'shaWithRSAEncryption' = 'shaWithRSAEncryption',
	'ssl2-md5' = 'ssl2-md5',
	'ssl3-md5' = 'ssl3-md5',
	'ssl3-sha1' = 'ssl3-sha1',
	'whirlpool' = 'whirlpool',
}

export enum ECipherAlgorithm {
	// CASTcbc = 'CAST-cbc',
	aes128cbc = 'aes-128-cbc',
	aes128cbchmacsha1 = 'aes-128-cbc-hmac-sha1',
	aes128cfb = 'aes-128-cfb',
	aes128cfb1 = 'aes-128-cfb1',
	aes128cfb8 = 'aes-128-cfb8',
	aes128ctr = 'aes-128-ctr',
	aes128ecb = 'aes-128-ecb',
	aes128gcm = 'aes-128-gcm',
	aes128ofb = 'aes-128-ofb',
	aes128xts = 'aes-128-xts',
	aes192cbc = 'aes-192-cbc',
	aes192cfb = 'aes-192-cfb',
	aes192cfb1 = 'aes-192-cfb1',
	aes192cfb8 = 'aes-192-cfb8',
	aes192ctr = 'aes-192-ctr',
	aes192ecb = 'aes-192-ecb',
	aes192gcm = 'aes-192-gcm',
	aes192ofb = 'aes-192-ofb',
	aes256cbc = 'aes-256-cbc',
	aes256cbchmacsha1 = 'aes-256-cbc-hmac-sha1',
	aes256cfb = 'aes-256-cfb',
	aes256cfb1 = 'aes-256-cfb1',
	aes256cfb8 = 'aes-256-cfb8',
	aes256ctr = 'aes-256-ctr',
	aes256ecb = 'aes-256-ecb',
	aes256gcm = 'aes-256-gcm',
	aes256ofb = 'aes-256-ofb',
	aes256xts = 'aes-256-xts',
	aes128 = 'aes128',
	aes192 = 'aes192',
	aes256 = 'aes256',
	bf = 'bf',
	bfcbc = 'bf-cbc',
	bfcfb = 'bf-cfb',
	bfecb = 'bf-ecb',
	bfofb = 'bf-ofb',
	blowfish = 'blowfish',
	'camellia-128-cbc' = 'camellia-128-cbc',
	'camellia-128-cfb' = 'camellia-128-cfb',
	'camellia-128-cfb1' = 'camellia-128-cfb1',
	'camellia-128-cfb8' = 'camellia-128-cfb8',
	'camellia-128-ecb' = 'camellia-128-ecb',
	'camellia-128-ofb' = 'camellia-128-ofb',
	'camellia-192-cbc' = 'camellia-192-cbc',
	'camellia-192-cfb' = 'camellia-192-cfb',
	'camellia-192-cfb1' = 'camellia-192-cfb1',
	'camellia-192-cfb8' = 'camellia-192-cfb8',
	'camellia-192-ecb' = 'camellia-192-ecb',
	'camellia-192-ofb' = 'camellia-192-ofb',
	'camellia-256-cbc' = 'camellia-256-cbc',
	'camellia-256-cfb' = 'camellia-256-cfb',
	'camellia-256-cfb1' = 'camellia-256-cfb1',
	'camellia-256-cfb8' = 'camellia-256-cfb8',
	'camellia-256-ecb' = 'camellia-256-ecb',
	'camellia-256-ofb' = 'camellia-256-ofb',
	'camellia128' = 'camellia128',
	'camellia192' = 'camellia192',
	'camellia256' = 'camellia256',
	'cast' = 'cast',
	castcbc = 'cast-cbc',
	cast5cbc = 'cast5-cbc',
	cast5cfb = 'cast5-cfb',
	cast5ecb = 'cast5-ecb',
	cast5ofb = 'cast5-ofb',
	des = 'des',
	descbc = 'des-cbc',
	descfb = 'des-cfb',
	descfb1 = 'des-cfb1',
	descfb8 = 'des-cfb8',
	desecb = 'des-ecb',
	desede = 'des-ede',
	desedecbc = 'des-ede-cbc',
	desedecfb = 'des-ede-cfb',
	desedeofb = 'des-ede-ofb',
	desede3 = 'des-ede3',
	desede3cbc = 'des-ede3-cbc',
	desede3cfb = 'des-ede3-cfb',
	desede3cfb1 = 'des-ede3-cfb1',
	desede3cfb8 = 'des-ede3-cfb8',
	desede3ofb = 'des-ede3-ofb',
	desofb = 'des-ofb',
	des3 = 'des3',
	desx = 'desx',
	desxcbc = 'desx-cbc',
	idaes128GCM = 'id-aes128-GCM',
	idaes192GCM = 'id-aes192-GCM',
	idaes256GCM = 'id-aes256-GCM',
	idea = 'idea',
	ideacbc = 'idea-cbc',
	ideacfb = 'idea-cfb',
	ideaecb = 'idea-ecb',
	ideaofb = 'idea-ofb',
	rc2 = 'rc2',
	rc240cbc = 'rc2-40-cbc',
	rc264cbc = 'rc2-64-cbc',
	rc2cbc = 'rc2-cbc',
	rc2cfb = 'rc2-cfb',
	rc2ecb = 'rc2-ecb',
	rc2ofb = 'rc2-ofb',
	rc4 = 'rc4',
	rc440 = 'rc4-40',
	rc4hmacmd5 = 'rc4-hmac-md5',
	seed = 'seed',
	seedcbc = 'seed-cbc',
	seedcfb = 'seed-cfb',
	seedecb = 'seed-ecb',
	seedofb = 'seed-ofb',
}

export default class CipherService {
	public fromBase64(data: string) {
		return Buffer.from(data, 'base64').toString('utf8');
	}

	public toBase64(data: string) {
		return Buffer.from(data).toString('base64');
	}

	public Hash(
		data: string,
		secret: string,
		algorithm: EHashAlgorithm = EHashAlgorithm.sha512,
	) {
		return crypto
			.createHmac(algorithm, Right(salt + secret, 32))
			.update(data, 'utf8')
			.digest('hex');
	}

	public Encrypt(
		data: any,
		secret: string,
		algorithm: ECipherAlgorithm = ECipherAlgorithm.aes256cfb,
	): string {
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(
			algorithm,
			Right(salt + secret, 32),
			iv,
		);
		const encrypted = Buffer.concat([
			cipher.update(JSON.stringify(data)),
			cipher.final(),
		]);
		const res = JSON.stringify({
			iv: iv.toString('hex'),
			content: encrypted.toString('hex'),
		});
		return this.toBase64(res);
	}

	public Decrypt(
		data: string,
		secret: string,
		algorithm: ECipherAlgorithm = ECipherAlgorithm.aes256cfb,
	): any {
		const hash = JSON.parse(this.fromBase64(data));
		const decipher = crypto.createDecipheriv(
			algorithm,
			Right(salt + secret, 32),
			Buffer.from(hash.iv, 'hex'),
		);
		const decrpyted = Buffer.concat([
			decipher.update(Buffer.from(hash.content, 'hex')),
			decipher.final(),
		]);
		return JSON.parse(decrpyted.toString());
	}
}
