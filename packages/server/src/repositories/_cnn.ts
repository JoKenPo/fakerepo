import knex, { Knex } from 'knex';
import { GetSecret } from '../services/Secrets.service';
export class Connection {
	public Qry: Knex<any, unknown[]>;
	public Transaction: Knex.Transaction<any, any[]>;

	constructor(key: string) {
		const connection = GetSecret(key, 'database');
		if (!connection) throw new Error(`Invalid connection key ${key}`);
		const options = {
			client: connection.client,
			debug: (process.env.DATABASE_DEBUG || 'false').toLowerCase() == 'true',
			connection: {
				host: connection.host,
				port: Number(connection.port),
				user: connection.user,
				password: connection.password,
				database: connection.database,
				charset: 'utf8',
				ssl: connection.ssl == 'true' ? { rejectUnauthorized: false } : false,
				connectTimeout: 5000,
			},
			pool: {
				min: 1,
				max: 20,
				acquireTimeoutMillis: 3000,
				idleTimeoutMillis: 60000,
				propagateCreateError: false,
				afterCreate: (conn: any, done: any) => {
					console.log('New connection on', connection.database);
					conn.query(`SET timezone='UTC'`, (err: any) => {
						if (err) {
							console.error(err);
						}
						done(err, conn);
					});
				},
			},
		};

		this.Qry = knex(options);
	}

	async BeginTran() {
		this.Transaction = await this.Qry.transaction();
	}
}
