//import { ksfw } from 'https://deno.land/x/ks_spa2@0.1.2/ksfw.ts';
import { ksfw } from '../ksfw.ts';

export class controller extends ksfw {

	post(sender, params) {
		for (const client of this.client_list) {
			client.socket.send(JSON.stringify({
				pathname: 'posted',
				params: {
					user: sender.user,
					text: params.text,
				}
			}));
		}
	}
}
