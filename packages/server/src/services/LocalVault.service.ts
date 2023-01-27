import fs from 'fs';

export default class LocalVault {
	async LoadSecrets(filename: string) {
		return new Promise<Array<any>>(resolve => {
			let secrets = [];
			console.log('LOCAL VAULT SERVICE START ... 🔐');
			try {
				if (fs.existsSync(filename)) {
					const secretFile = fs.readFileSync(process.env.SECRET_FILE);
					secrets = JSON.parse(secretFile.toString());
					console.log(
						'LOCAL SECRETS OK!!!!',
						secrets.length,
						' SECRETS LOADED',
					);
				}
			} catch (err) {
				console.log('ERROR TO START');
			}
			resolve(secrets);
		});
	}
}
