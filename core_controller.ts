import { extname, contentType } from './deps.ts';

export class core_controller {

	static get_body(path) {
		if (extname(path) !== '.html') return Deno.readFileSync(path);
		let body = Deno.readTextFileSync(path);
		while (body.match(/<!-- include (\S+) -->/)) {
			body = body.replace(/<!-- include (\S+) -->/g, function () {
				return this.get_body(arguments[1]).trimEnd();
			}.bind(this));
		}
		return body;
	}

	static respond(pathname) {
		for (const directory of ['./client', './design/entry_point']) {
			try {
				const body = this.get_body(directory + '/' + pathname);
				return new Response(body, {
					headers: {
						'Content-Type': contentType(extname(pathname)),
					},
				});
			} catch (error) {
			}
		}
		return new Response('Not Found', {
			status: 404,
			headers: {
				'Content-Type': contentType('.html'),
			},
		});
	}

	static handler(request) {
		const url = new URL(request.url);
		const pathname = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
		const params = {};
		for (const [key, value] of url.searchParams) {
			params[key] = value;
		}
		return this.respond(pathname);
	}
}
