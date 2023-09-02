/// <reference types="lucia" />

declare global {
	namespace Lucia {
		type Auth = import('$lib/lucia').Auth;
		type DatabaseUserAttributes = {
			email: string;
			github_username?: string;
		};
		type DatabaseSessionAttributes = object;
	}

	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };

