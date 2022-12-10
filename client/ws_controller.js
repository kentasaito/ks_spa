class ws_controller {

	static socket;
	static timeout_id;

	static initialize_ws_controller() {
		this.socket = new WebSocket(location.protocol.replace(/http/, 'ws') + '//' + location.hostname + ':' + location.port + '/ws');

		// onopen
		this.socket.onopen = () => {
			console.log('onopen:');
		};

		// onmessage
		this.socket.onmessage = event => {
			const data = JSON.parse(event.data);
			this[data.pathname](data.params);
		};

		// onclose
		this.socket.onclose = () => {
			console.log('onclose:');
			clearTimeout(this.timeout_id);
			this.timeout_id = setTimeout(this.initialize_ws_controller.bind(this), 3000);
		};

		// onerror
		this.socket.onerror = event => {
			console.error('onerror:', event);
		};
	}
}
