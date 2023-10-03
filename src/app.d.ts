/// <reference types="lucia" />

declare global {
	namespace Lucia {
		type Auth = import('$lib/lucia/mysql').Auth;
		type DatabaseUserAttributes = {
			email: string;
			email_verified: boolean;
			github_username?: string;
		};
		type DatabaseUserProfileAttributes = {
			client_id: string;
			role: string;
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
		interface Client {
			id: string;
			name: string;
			contactUserId: string | null;
			created: bigint;
			updated: bigint;
			deleted: bigint | null;
		}
	}
}

export { };

