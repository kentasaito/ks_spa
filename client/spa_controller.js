class spa_controller {

	static initialize_spa_controller() {
		window.onpopstate = event => {
			this.push_state(event.state.state_name, event.state.params, true);
		};
		this.push_state('main', {}, true);
	}

	static push_state(state_name, params = {}, replace = false) {
		history[replace ? 'replaceState' : 'pushState']({state_name, params}, '');
		for (const element of document.querySelectorAll('.state')) {
			element.style.display = element.id === `${state_name}_state` ? 'flex' : 'none';
		}
	}
}
