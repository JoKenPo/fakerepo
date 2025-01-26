import request from 'supertest';
import Server from '../../src/server';

describe('Authentication', () => {
	beforeEach(async () => {
		// await truncate();
	});

	const app = new Server();
	const header = {
		Basic: process.env.BASIC_USER + ':' + process.env.BASIC_PASSWORD,
		key: 'localhost',
	};

	it('should be able to login', async () => {
		const userAuth = {
			email: 'eduardo.almeida.job@gmail.com',
			password: '1234',
		};
		const response = await request(app.app)
			.post('/login')
			.set(header)
			.send(userAuth);

		expect(response.status).toBe(200);
	});

	it('should be logged', async () => {
		const userAuth = {
			email: 'eduardo.almeida.job@gmail.com',
			password: '1234',
		};
		const user = await request(app.app)
			.post('/login')
			.set(header)
			.send(userAuth);

		const token = user.body.auth.token;

		const response = await request(app.app)
			.get('/me')
			.set({ ...header, Authorization: `Bearer ${token as string}` });

		expect(response.status).toBe(200);
	});

	it('should not be able to login', async () => {
		const userAuth = {
			email: 'eduardo.almeida@gmail.com',
			password: '123456',
		};
		const response = await request(app.app)
			.post('/login')
			.set(header)
			.send(userAuth);

		expect(response.status).toBe(400);
	});
});
