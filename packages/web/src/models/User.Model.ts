
export interface ILoggedUser {
    id: Number;
    nome: string;
    departamento: string;
    id_permissao: number;
    acesso: string;
    roles: Array<string>;
    url_foto:string;
    cliente: {
        id: number,
        nome: string,
    }
}


export interface IUserList {
    id: Number;
    nome: string;
    departamento: string;
    id_permissao: number;
    acesso: string;
    roles: Array<string>;
    cliente: {
        id: number,
        nome: string,
    }
}