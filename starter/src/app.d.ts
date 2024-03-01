/// <reference types="lucia" />

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import("lucia").User | null;
			session: import("lucia").Session | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };

