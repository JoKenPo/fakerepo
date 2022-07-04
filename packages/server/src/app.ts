import dotenv from 'dotenv';
dotenv.config();
import Server from './server';

const start = () => {
	new Server().listen(parseInt(process.env.PORT as string, 10));
	console.log('Server environment: ', process.env.NODE_ENV?.toLowerCase());
};

start();
