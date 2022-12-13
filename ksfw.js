export class ksfw {

	constructor() {
		for (const element of document.querySelectorAll('.state')) {
			element.style.display = 'none';
			element.style.flexDirection = 'column';
		}
		window.onpopstate = event => {
			this.push_state(event.state.state_name, event.state.params, true);
		};
		this.push_state('main', {}, true);

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
			this.timeout_id = setTimeout(this.constructor.bind(this), 3000 + Math.random() * 3000);
		};

		// onerror
		this.socket.onerror = event => {
			console.error('onerror:', event);
		};
	}

	push_state(state_name, params = {}, replace = false) {
		history[replace ? 'replaceState' : 'pushState']({state_name, params}, '');
		for (const element of document.querySelectorAll('.state')) {
			element.style.display = element.id === `${state_name}_state` ? 'flex' : 'none';
		}
	}
}
