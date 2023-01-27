import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const permissionId = '0730ffac-d039-4194-9571-01aa2aa0efbd';

const clientId = '00880d75-a933-4fef-94ab-e05744435297';

const userId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00';

async function run() {
	/**
	 * Create permissions
	 */
	await Promise.all([
		prisma.permissoes.create({
			data: {
				id: permissionId,
				role: 'ADMIN',
			},
		}),
	]);

	await Promise.all([
		/**
		 * Create clients
		 */
		prisma.clientes.create({
			data: {
				id: clientId,
				nome: 'Github',
			},
		}),
	]);

	await Promise.all([
		/**
		 * Create users
		 */
		prisma.usuarios.create({
			data: {
				id: userId,
				nome: 'Eduardo Almeida',
				email: 'eduardo.almeida.job@gmail.com',
				password: '81dc9bdb52d04dc20036dbd8313ed055',
				departamento: 'Desenvolvimento',
				url_foto: 'https://avatars.githubusercontent.com/u/3427820?v=4',
				id_permissao: permissionId,
				id_cliente: clientId,
			},
		}),
	]);
}

run()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
