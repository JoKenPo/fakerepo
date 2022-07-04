import { Knex } from 'knex';
import { Connection } from './_cnn';

export class RepositoryBase {
	protected Connection: Connection;
	// protected trn: any;

	// constructor(config?: { key?: string, cnn?: any, transaction?: any }) {
	//     if (config?.key) this.Connect(config?.key);
	//     if (config?.cnn) this._db = config.cnn;
	//     if (config?.transaction) this.BeginTran(config.transaction);
	// }

	constructor(connection: Connection) {
		this.Connection = connection;
	}

	// Begintran = (): void => {
	//     const trn = this.Connection.BeginTran()

	// }

	// Connect(key: string) {
	//     if (!this._db) this._db = new Connection(key).GetConnection();
	//     return this;
	// }
}
