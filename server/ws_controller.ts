import { DB } from 'https://deno.land/x/sqlite@v3.7.0/mod.ts';

export class ws_controller {

	static client_list = [];
	static db = new DB('./ksfw.db');

	static {
		this.db.execute(`
			CREATE TABLE IF NOT EXISTS user (
				user_id INTEGER PRIMARY KEY AUTOINCREMENT,
				user_uuid TEXT UNIQUE
			)
		`);
	}

	static handler(request) {
		const url = new URL(request.url);
		const pathname = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
		const params = {};
		for (const [key, value] of url.searchParams) {
			params[key] = value;
		}
		if (pathname === 'ws') {
			const { socket, response } = Deno.upgradeWebSocket(request);

			// onopen
			socket.onopen = event => {

				let user;
				let user_uuid = params.user_uuid;
				while (true) {
					user = this.db.prepareQuery('SELECT * FROM user WHERE user_uuid = :user_uuid').firstEntry({
						user_uuid,
					});
					if (user) break;
					user_uuid = crypto.randomUUID()
					this.db.prepareQuery('INSERT INTO user (user_uuid) VALUES (:user_uuid)').execute({
						user_uuid,
					});
				}
				const new_user = JSON.parse(JSON.stringify(user));
				delete new_user.user_uuid;
				this.client_list.push({
					user: new_user,
					socket: event.target,
				});

				console.log('onopen:', 'number of clients:', this.client_list.length);
				const client = this.client_list.find(client => client.socket === event.target);
				socket.send(JSON.stringify({
					pathname: 'connected',
					params: {
						user,
					}
				}));
			};

			// onmessage
			socket.onmessage = event => {
				const client = this.client_list.find(client => client.socket === event.target);
				const data = JSON.parse(event.data);
				this[data.pathname](client, data.params);
			}

			// onclose
			socket.onclose = event => {
				this.client_list = this.client_list.filter(client => client.socket !== event.target);
				console.log('onclose:', 'number of clients:', this.client_list.length);
			}

			// onerror
			socket.onerror = event => {
				console.error('onerror:', event);
			}

			return response;
		}
		else {
			return this.respond(pathname);
		}
	}
}
