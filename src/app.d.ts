/// <reference types="lucia" />

declare global {
	namespace Lucia {
		type Auth = import('$lib/lucia/mysql').Auth;
		type DatabaseUserAttributes = {
			email: string;
			email_verified: boolean
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

