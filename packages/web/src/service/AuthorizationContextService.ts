import * as http from '../helpers/http';

import { writeStore } from '../helpers/persistence'
import { ILoggedUser } from '../models/User.Model';

class AuthorizationService {

    me = async (): Promise<ILoggedUser | undefined> => {
        const res: any = await http.get('/me')
        return res && res.success ? res.data : undefined;
    };

    login = (email: String, password: String): Promise<ILoggedUser | undefined> => {
        return new Promise(async (resolve, reject) => {
            const res: any = await http.post('/login', { email, password });
            if (res && res.success) {
                if (res.data.auth.token) await writeStore('token', res.data.auth.token)
                if (res.data.auth.refreshToken) await writeStore('refresh-token', res.data.auth.refreshToken)
                return resolve(res.data.user as ILoggedUser);
            }
            return reject(undefined);
        });
    }


    logout = async (): Promise<boolean> => {
        return true;
    };

}

export default new AuthorizationService();
