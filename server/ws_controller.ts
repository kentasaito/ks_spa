export class ws_controller {

	static user_list = [];
	static user_id = 1;
	static client_list = [];
	static client_id = 1;

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
				let user = this.user_list.find(user => user.user_uuid === params.user_uuid);
				if (!user) {
					user = {
						user_id: this.user_id++,
						user_uuid: crypto.randomUUID(),
					}
					this.user_list.push(user);
				}
				this.client_list.push({
					user: user,
					client_id: this.client_id++,
					socket: event.target,
				});
				console.log('onopen:', 'number of clients:', this.client_list.length);
				const client = this.client_list.find(client => client.socket === event.target);
				socket.send(JSON.stringify({
					pathname: 'connected',
					params: {
						user_id: user.user_id,
						user_uuid: user.user_uuid,
						client_id: client.client_id,
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
