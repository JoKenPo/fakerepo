import mapper from 'object-mapper';
import { RepositoryBase } from '../_repository.base';
import { Connection } from '../_cnn';
// import { ILoginResult } from '../../controllers/authorization/authorization.controller';
// import { LoginResultMapper, usuarioPermissao } from '../constants/usuarios.constats';

// Prisma Libs
import { z } from 'zod';
import { prisma } from '../../services/prisma.service';

export const LoginResultMapper = {
	id_usuario: 'id',
	nome: 'nome',
	departamento: 'departamento',
	id_permissao: 'id_permissao',
	permissao: 'acesso',
	url_foto: 'url_foto',
	id_cliente: 'cliente.id',
	cliente_nome: 'cliente.nome',
};

export const LoginResultPrismaMapper = {
	id: 'id',
	nome: 'nome',
	departamento: 'departamento',
	id_permissao: 'id_permissao',
	permissao: 'acesso',
	url_foto: 'url_foto',
	id_cliente: 'cliente.id',
	// cliente_nome: 'cliente.nome',
};

export const usuarioPermissao = (value: string): string => {
	switch (value) {
		case '0730ffac-d039-4194-9571-01aa2aa0efbd':
			return 'Master';
		case '2':
			return 'Normal';
		case '3':
			return 'Read-Only';
		case '4':
			return 'Esforço Colaborativo';
	}
};

// SQL Class
export class UsuarioLoginRepository extends RepositoryBase {
	constructor(connection: Connection) {
		super(connection);
	}

	async Login(email: string, password: string): Promise<any> {
		const response = await this.Connection.Qry('usuario')
			.select([
				'usuario.id_usuario',
				'usuario.nome',
				'usuario.id_permissao',
				'usuario.id_cliente',
				'usuario.url_foto',
				'departamento.descricao as departamento',
				'cliente.nome as cliente_nome',
			])
			.join('departamento', 'usuario.id_departamento', 'departamento.id')
			.join('cliente', 'usuario.id_cliente', 'cliente.id_cliente')
			.where('usuario.email', email)
			.where('usuario.password', password)
			.where('usuario.situacao', 1)
			.where('usuario.status', true)
			.whereNull('usuario.excluido_em')
			.first();
		const result = mapper.merge(
			{
				...response,
				permissao: usuarioPermissao(response.id_permissao),
			},
			LoginResultMapper,
		);
		return result;
	}
}

// Prisma Class
export class UsuarioLoginPrismaRepository {
	async Login(email: string, password: string): Promise<any> {
		try {
			let result = {};

			const user = await prisma.usuarios.findUnique({
				where: {
					email: email,
				},
			});

			if (user) {
				if (user.password === password) {
					result = mapper.merge(
						{
							...user,
							permissao: usuarioPermissao(user.id_permissao),
						},
						LoginResultPrismaMapper,
					);

					return result;
				}
			}
		} catch {}
		throw new Error('User not found');
	}
}
