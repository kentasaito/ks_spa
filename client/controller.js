import { ksfw } from './ksfw.js';

export class controller extends ksfw {

	constructor() {
		super();
		document.getElementById('text').focus();
		document.getElementById('to_about_state').onclick = event => {
			event.preventDefault();
			this.push_state('about');
		}
		document.getElementById('text').onkeydown = event => {
			if (event.key === 'Enter') {
				this.post(document.getElementById('text').value);
				document.getElementById('text').value = '';
			}
		}
	}

	connected(params) {
		document.getElementById('user_id').innerText = params.user.user_id;
	}

	posted(params) {
		const element = document.createElement('div');
		element.innerText = 'user_' + params.user.user_id + ': ' + params.text;
		document.getElementById('output').prepend(element);
	}

	post(text) {
		this.socket.send(JSON.stringify({
			pathname: 'post',
			params: {
				text,
			}
		}));
	}
}
