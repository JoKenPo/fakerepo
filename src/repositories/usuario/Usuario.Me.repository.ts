import mapper from 'object-mapper';
import { RepositoryBase } from '../_repository.base';
import { Connection } from '../_cnn';
import { LoginResultMapper, usuarioPermissao } from './Usuario.Login.repository';
// import { LoginResultMapper, usuarioPermissao } from '../constants/usuarios.constats';

export class UsuarioMeRepository extends RepositoryBase {

    constructor(connection: Connection) {
        super(connection);
    }

    async Me(id: number): Promise<any> {
        const response = await this.Connection.Qry('usuario')
            .select([
                'usuario.id_usuario',
                'usuario.nome',
                'usuario.id_permissao',
                'usuario.id_cliente',
                'usuario.url_foto',
                'departamento.descricao as departamento',
                'cliente.nome as cliente_nome'
            ])
            .join('departamento', 'usuario.id_departamento', 'departamento.id')
            .join('cliente', 'usuario.id_cliente', 'cliente.id_cliente')
            .where('usuario.id_usuario', id)
            .where('usuario.situacao', 1)
            .where('usuario.status', true)
            .whereNull('usuario.excluido_em')
            .first()
        if (response) {
            const result = mapper.merge({
                ...response,
                permissao: usuarioPermissao(response.id_permissao)
            }, LoginResultMapper);
            return result;// as ILoginResult;
        }
        return undefined;
    };


}

