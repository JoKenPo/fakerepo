import md5 from 'md5'
// import { Connection } from '../../repositories/_cnn';
import { ControllerBase } from '../_controller.base';
import { tokenVerify, getTokenData } from '../../services/authorization.service';


// Usuario Logado /////////////////////////////////
export interface ILoggedUser {
    id: number
    // id_cliente: number
    // id_permissao: number,
};

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

    constructor(dbKey: string, user: ILoggedUser) {
        super('AuthorizationController', dbKey, user);
    }

    async Login({ email, password }: { email: string, password: string }) {
        try {
            const hash = md5(password);
            // const cnn = new Connection(this.dbKey);
            // const user = await new UsuarioLoginRepository(cnn).Login(email, hash);
            const user = {id:1, nome:'Eduardo'}
            if (user) return { user, auth: getTokenData(user.id, this.dbKey, true) };
        } catch { };
        throw new Error("Access Denied");
    }

    async Me() {
        try {
            const cache = await this.Cache.Get(`${this.dbKey}${this.getName()}me${this.user.id}`)
            if (cache) {
                await this.Cache.Set(`${this.dbKey}${this.getName()}me${this.user.id}`, cache, 120)
                return cache;
            }
            // const cnn = new Connection(this.dbKey);
            // const user = await new UsuarioMeRepository(cnn).Me(this.user.id);
            const user = {id:1, nome:'Eduardo'}
            await this.Cache.Set(`${this.dbKey}${this.getName()}me${this.user.id}`, user, 120)
            return user
        } catch { }
        throw new Error("Access Denied");
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
        } catch { }
        throw new Error("Access Denied");
    }


    async CreateApiToken(expire: number) {
        try {
            return { auth: getTokenData(0, this.dbKey, false, expire ? expire * 24 * 60 : 43200) };
        } catch { }
        throw new Error("Access Denied");
    }
}