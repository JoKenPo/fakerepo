import { io } from 'socket.io-client';

const socket = io(process.env.SOCKETIO_DOMAIN || 'http://localhost:4003/');

// socket.emit('ping');
// socket.on('pong', () => console.log('pong'));
