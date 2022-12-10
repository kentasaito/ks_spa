import { controller } from './controller.js';

function extend(to, from) {
	class dummy {};
	for (const name of Object.getOwnPropertyNames(from)) {
		if (!Object.getOwnPropertyNames(dummy).includes(name)) {
			to[name] = from[name];
		}
	}
	to['initialize_' + from.name]();
}

extend(controller, spa_controller);
extend(controller, ws_controller);

window.onload = () => {
	controller.initialize_controller();
};
