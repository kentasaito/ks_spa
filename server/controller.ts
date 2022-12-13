import { ksfw } from 'https://deno.land/x/ks_spa2@0.1.3/ksfw.ts';
//import { ksfw } from '../ksfw.ts';

export class controller extends ksfw {

	post(sender, params) {
		this.broadcast('posted', {
			user: sender.user,
			text: params.text,
		});
	}
}
