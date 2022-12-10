class ws_controller {

	static socket;
	static timeout_id;

	static initialize_ws_controller() {
		this.socket = new WebSocket(location.protocol.replace(/http/, 'ws') + '//' + location.hostname + ':' + location.port + '/ws' + (localStorage.getItem('user_uuid') ? '?user_uuid=' + localStorage.getItem('user_uuid') : '') );

		// onopen
		this.socket.onopen = () => {
			console.log('onopen:');
		};

		// onmessage
		this.socket.onmessage = event => {
			const data = JSON.parse(event.data);
			if (data.pathname === 'connected') {
				localStorage.setItem('user_uuid', data.params.user.user_uuid);
			}
			this[data.pathname](data.params);
		};

		// onclose
		this.socket.onclose = () => {
			console.log('onclose:');
			clearTimeout(this.timeout_id);
			this.timeout_id = setTimeout(this.initialize_ws_controller.bind(this), 3000 + Math.random() * 3000);
		};

		// onerror
		this.socket.onerror = event => {
			console.error('onerror:', event);
		};
	}
}
