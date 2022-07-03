import fs from 'fs'

export default class LocalVault {
    async LoadSecrets(filename: string) {
        return new Promise<Array<any>>((resolve) => {
            let secrets = [];
            console.log("LOCAL VAULT SERVICE START ...");
            try {
                if (fs.existsSync(filename)) {
                    const secretfile = fs.readFileSync(process.env.SECRET_FILE);
                    secrets = JSON.parse(secretfile.toString());
                    console.log('LOCAL SECRETS OK!!!!', secrets.length, ' SECRETS LOADED');
                }
            } catch (err) { }
            resolve(secrets);
        })
    }
}


