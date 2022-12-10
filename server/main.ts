import { serve, serveTls } from 'https://deno.land/std@0.166.0/http/server.ts';
import { controller } from './controller.ts';

if (parseInt(Deno.env.get('USE_TLS'))) {
	serveTls(controller.handler.bind(controller), {
		port: Deno.env.get('REMOTE_PORT'),
		certFile: '/home/deno/.getssl/' + Deno.env.get('FQDN') + '/' + Deno.env.get('FQDN') + '.crt',
		keyFile: '/home/deno/.getssl/' + Deno.env.get('FQDN') + '/' + Deno.env.get('FQDN') + '.key',
	});
	const watcher = Deno.watchFs('/home/deno/.getssl/' + Deno.env.get('FQDN') + '/' + Deno.env.get('FQDN') + '.crt');
	for await (const event of watcher) {
		if (event.kind === 'modify') {
			Deno.utimeSync(new URL(import.meta.url).pathname, new Date(), new Date());
		}
	}
}
else {
	serve(controller.handler.bind(controller), {
		port: Deno.env.get('LOCAL_PORT'),
	});
}
