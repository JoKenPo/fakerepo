import * as SocketIO from 'socket.io';
import fastq, { queueAsPromised } from 'fastq';
import { tokenVerify } from './authorization.service';
import { SetKey } from '../middlewares/authorization.middleware';
import {
	ILoggedUser,
	IPrismaLoggedUser,
} from '../controllers/authorization/authorization.controller';

const CONCURRENCY = 1;

const colors = [
	'#4CD964',
	'#FFD200',
	'#007AFF',
	'#F63854',
	'#86A239',
	'#7CD0DD',
];

/*

    Exemplo de uso:
    na controller:

    IOSendToClient('UsuarioUpdate', this.dbKey, this.user.id_cliente, { id_parlamentar: id, data })

*/

interface IIOSendToAll {
	event: string;
	data: any;
}
interface IIOSendToKey {
	key: string;
	event: string;
	data: any;
}
interface IIOSendToClient {
	key: string;
	clientId: number;
	event: string;
	data: any;
}
interface IIOSendToUser {
	key: string;
	userId: number;
	event: string;
	data: any;
}
interface IIOSendToRoom {
	key: string;
	roomId: number;
	event: string;
	data: any;
}

interface IActiveUser extends ILoggedUser {
	id: number;
	nome: string;
	url_foto: string;
	color?: string;
	range?: {
		index: number;
		length: number;
	};
}

const qIOSendToAll: queueAsPromised<IIOSendToAll> = fastq.promise(
	IOSendToAllWorker,
	CONCURRENCY,
);
const qIOSendToUser: queueAsPromised<IIOSendToUser> = fastq.promise(
	IOSendToUserWorker,
	CONCURRENCY,
);
const qIOSendToRoom: queueAsPromised<IIOSendToRoom> = fastq.promise(
	IOSendToRoomWorker,
	CONCURRENCY,
);

let clientList: Array<{
	socket: SocketIO.Socket;
	user: IActiveUser;
	key: string;
}> = [];

let roomList: Array<{
	event: string;
	roomId: number;
	usersIn: number[];
	lastContent?: any;
}> = [];

async function IOSendToAllWorker(data: IIOSendToAll) {
	return await new Promise<void>((resolve, reject) => {
		try {
			if (clientList.length > 0)
				clientList.map(item =>
					item.socket.broadcast.emit(data.event, data.data),
				);
		} catch {}
		resolve();
	});
}

async function IOSendToUserWorker(data: IIOSendToUser) {
	return await new Promise<void>((resolve, reject) => {
		try {
			const socketList = clientList.filter(
				item => item.key === data.key && item.user.id === data.userId,
			);
			if (socketList.length > 0)
				socketList.map(item =>
					item.socket.broadcast.emit(data.event, data.data),
				);
		} catch {}
		resolve();
	});
}

async function IOSendToRoomWorker(data: IIOSendToRoom) {
	return await new Promise<void>((resolve, reject) => {
		try {
			const eventName = data.event + '_' + String(data.roomId);
			const roomExist = roomList.filter(
				room =>
					room.roomId === Number(data.roomId) &&
					room.event === String(data.event),
			);

			if (roomExist.length === 0) {
				//Se Room não existe, criar
				const newRoom = {
					roomId: Number(data.roomId),
					event: data.event,
					usersIn: [data.data.user.id],
					lastContent: data.data.text,
				};
				roomList.push(newRoom);
				roomExist.push(newRoom);
			}

			// Se não estiver logado nesse room, listar dentro do roomList
			const userLoggedIn = roomExist[0].usersIn.filter(
				x => x === Number(data.data.user.id),
			);
			if (userLoggedIn.length === 0) {
				roomList.map(room => {
					if (
						room.roomId === Number(data.roomId) &&
						room.event === String(data.event)
					)
						room.usersIn.push(data.data.user.id);
				});
			}

			const socketList = clientList.filter(
				item =>
					item.key === String(data.key) && item.socket.rooms.has(eventName),
			);

			if (socketList.length > 0) {
				const activeUsers = socketList.map((item, index) => {
					item.user.color = colors[index];
					if (item.user.id === data.data.user.id) {
						item.user.range = data.data.user.range;
					} else {
						if (item.user.range) {
							if (data.data.user.range)
								item.user.range.index =
									data.data.user.range.index > item.user.range.index
										? item.user.range.index
										: item.user.range.index + 1;
						} else {
							item.user.range = { index: 0, length: 0 };
						}
					}
					return item.user;
				});

				roomList.map(room => {
					if (
						room.roomId === Number(data.roomId) &&
						room.event === String(data.event)
					)
						room.lastContent = data.data.text;
				});

				socketList.map(item => {
					data.data.user = activeUsers;
					item.socket.broadcast.to(eventName).emit(eventName, data.data);
				});
			}
		} catch {}
		resolve();
	});
}

const validateToken = (token: string, key: string): IPrismaLoggedUser => {
	try {
		console.log(token);
		if (token && token.startsWith('Bearer ')) {
			const result: any = tokenVerify(token.split(' ')[1], key);
			if (result.data.type === 1) {
				return {
					id: result.data.id,
					id_cliente: result.data.cliente.id,
					id_permissao: result.data.level,
				};
			}
		}
	} catch (err) {}
	return undefined;
};

export const IOSendToAll = (event: string, data: any = undefined) =>
	qIOSendToAll.push({ event, data });

export const IOSendToUser = (
	event: string,
	key: string,
	userId: number,
	data: any = undefined,
) => qIOSendToUser.push({ key, userId, event, data });

export const IOSendToRoom = (
	event: string,
	key: string,
	roomId: number,
	data: any = undefined,
) => qIOSendToRoom.push({ key, roomId, event, data });

export const IOServer = (io: SocketIO.Server) => {
	io.use((socket, next) => {
		console.log(socket.handshake.headers);
		console.log('SocketIO Connection');
		next();
		if (
			!socket.handshake.headers.key &&
			process.env.NODE_ENV &&
			process.env.NODE_ENV.toLowerCase() === 'development'
		)
			socket.handshake.headers.key = 'dev';
		if (
			!socket.handshake.headers.key ||
			!socket.handshake.auth.user ||
			!socket.handshake.auth.token
		)
			return;
		const user = validateToken(
			'Bearer ' + String(socket.handshake.auth.token),
			String(socket.handshake.headers.key),
		);
		console.log('user: ', user);
		if (user && socket.handshake.auth.user.id === user.id) next();
	});

	io.on('connection', socket => {
		if (
			!socket.handshake.headers.key &&
			process.env.NODE_ENV &&
			process.env.NODE_ENV.toLowerCase() === 'development'
		)
			socket.handshake.headers.key = 'localhost';

		// console.log(
		//   socket.handshake.headers.key,
		//   'user',
		//   socket.handshake.auth.user,
		//   'auth',
		//   socket.handshake.headers.authorization,
		// );

		// if (
		// 	!socket.handshake.headers.key ||
		// 	!socket.handshake.auth.user ||
		// 	!socket.handshake.headers.authorization
		// ) {
		// 	return socket.disconnect();
		// }

		// const user = validateToken(
		// 	String(socket.handshake.headers.authorization),
		// 	String(SetKey(String(socket.handshake.headers.key))),
		// );

		// if (!user || socket.handshake.auth.user.id !== user.id) {
		// 	return socket.disconnect();
		// }

		socket.on('ping', () => {
			socket.emit('pong');
		});

		socket.on(
			'sendToRoom',
			(
				event: string,
				roomId: number,
				data: any = undefined,
				user: IActiveUser,
			) => {
				const completeData = {
					text: data,
					user: user,
				};
				if (!socket.rooms.has(event + '_' + roomId))
					socket.join(event + '_' + roomId);
				IOSendToRoom(
					event,
					String(socket.handshake.headers.key),
					roomId,
					completeData,
				);
			},
		);

		socket.on(
			'connectToRoom',
			(event: string, roomId: number, user: IActiveUser) => {
				if (!socket.rooms.has(event + '_' + roomId))
					socket.join(event + '_' + roomId);
				let texto = '';
				roomList.map(async room => {
					if (room.roomId === Number(roomId) && room.event === String(event))
						texto = String(room.lastContent);
				});

				if (texto !== '') {
					const completeData = {
						text: texto,
						user: user,
					};
					IOSendToRoom(
						event,
						String(socket.handshake.headers.key),
						roomId,
						completeData,
					);
				}
			},
		);

		socket.on(
			'disconnectToRoom',
			(event: string, roomId: number, user: IActiveUser) => {
				if (socket.rooms.has(event + '_' + roomId))
					roomList.map(async room => {
						if (room.roomId === Number(roomId) && room.event === String(event))
							room.usersIn = room.usersIn.filter(u => u !== user.id);
					});
				roomList = roomList.filter(room => room.usersIn.length > 0); // Se não tem ninguem na room, excluir
			},
		);

		socket.on('disconnect', () => {
			clientList = clientList.filter(item => item.socket !== socket); //item.user.id !== socket.handshake.auth.user.id
		});

		clientList.push({
			socket,
			user: {
				id: socket.handshake.auth.user.id,
				nome: socket.handshake.auth.user.nome,
				url_foto: socket.handshake.auth.user.url_foto,
			},
			key: String(socket.handshake.headers.key),
		});
	});
};
