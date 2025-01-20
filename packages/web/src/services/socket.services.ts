import { io, Socket } from 'socket.io-client';

// socket.emit('ping');
// socket.on('pong', () => console.log('pong'));

interface IActiveUser {
	id: string;
	nome: string;
	url_foto: string;
	token?: string;
}

interface ISocketResponse {
	text: any;
	user: IActiveUser;
}

export class SocketIOClient {
	private socket: Socket;
	private user: IActiveUser;

	constructor(user: IActiveUser) {
		this.user = user;

		// Inicializa o socket com autenticação e headers
		this.socket = io(process.env.SOCKETIO_DOMAIN || 'http://localhost:4003/', {
			auth: { user, token: this.user.token },
		});

		// Configura handlers padrão
		this.setupDefaultHandlers();
	}

	private setupDefaultHandlers() {
		this.socket.on('connect', () => {
			console.log('Conectado ao servidor Socket.IO');
		});

		this.socket.on('disconnect', () => {
			console.log('Desconectado do servidor Socket.IO');
		});

		this.socket.on('error', (error: Error) => {
			console.error('Erro na conexão Socket.IO:', error);
		});
	}

	// Envia dados para uma sala específica
	public sendToRoom(event: string, roomId: number, data?: any) {
		this.socket.emit('sendToRoom', event, roomId, data, this.user);
	}

	// Conecta a uma sala específica
	public connectToRoom(event: string, roomId: number) {
		this.socket.emit('connectToRoom', event, roomId, this.user);
	}

	// Desconecta de uma sala específica
	public disconnectFromRoom(event: string, roomId: number) {
		this.socket.emit('disconnectToRoom', event, roomId, this.user);
	}

	// Desconecta o socket completamente
	public disconnect() {
		this.socket.disconnect();
	}

	// Registra um listener para eventos em uma sala específica
	public onRoomEvent(
		event: string,
		roomId: number,
		callback: (data: ISocketResponse) => void,
	) {
		const roomEvent = `${event}_${roomId}`;
		this.socket.on(roomEvent, (data: ISocketResponse) => {
			callback(data);
		});
	}

	// Remove um listener específico
	public offRoomEvent(event: string, roomId: number) {
		const roomEvent = `${event}_${roomId}`;
		this.socket.off(roomEvent);
	}

	// Verifica se está conectado
	public isConnected(): boolean {
		return this.socket.connected;
	}
}

// Exemplo de uso:
/*
const socketClient = new SocketIOClient('http://seu-servidor:porta', {
  id: 'user123',
  nome: 'João',
  url_foto: 'http://exemplo.com/foto.jpg'
});

// Conectar a uma sala
socketClient.connectToRoom('edicao', 123);

// Escutar eventos da sala
socketClient.onRoomEvent('edicao', 123, (data) => {
  console.log('Dados recebidos:', data);
});

// Enviar dados para a sala
socketClient.sendToRoom('edicao', 123, { conteudo: 'novo texto' });

// Desconectar da sala quando necessário
socketClient.disconnectFromRoom('edicao', 123);
*/
