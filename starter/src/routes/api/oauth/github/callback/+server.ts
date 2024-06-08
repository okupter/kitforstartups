import { githubAuth } from '$lib/lucia/oauth.js';
import { lucia } from '$lib/lucia/turso';
import {
    createUser,
    getUserByEmail,
    getUserProfileData,
    updateUserProfileData
} from '$lib/server/db/turso/models/users';
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';

export const GET = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	const savedState = cookies.get('github_oauth_state');

	if (!code || !state || !savedState || state !== savedState) {
		console.error('Invalid state or code');

		return new Response(null, {
			status: 400,
			statusText: 'Bad Request'
		});
	}

	try {
		const tokens = await githubAuth.validateAuthorizationCode(code);
		const githubUserEmailsResponse = await fetch('https://api.github.com/user/emails', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUserEmails: GitHubUserEmail[] = await githubUserEmailsResponse.json();

		// Get the primary email address
		const primaryEmailAddress = githubUserEmails.find((email) => email.primary)?.email;

		if (!primaryEmailAddress) {
			return new Response(null, {
				status: 400,
				statusText: 'No email provided by GitHub'
			});
		}

		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await githubUserResponse.json();

		const existingUser = await getUserByEmail(primaryEmailAddress);

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {
				created_at: new Date(),
				updated_at: new Date()
			});
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			// Update the user's profile data
			const profile = await getUserProfileData(existingUser.id);

			await updateUserProfileData({
				userId: existingUser.id,
				firstName: profile?.firstName || githubUser.name.split(' ')[0],
				lastName: profile?.lastName || githubUser.name.split(' ')[1],
				picture: profile?.picture || githubUser.avatar_url
			});
		} else {
			const userId = generateId(15);
			await createUser({
				id: userId,
				email: primaryEmailAddress,
				emailVerified: true,
				githubUsername: githubUser.login
			});

			await updateUserProfileData({
				userId: userId,
				firstName: githubUser.name.split(' ')[0],
				lastName: githubUser.name.split(' ')[1],
				picture: githubUser.avatar_url
			});

			const session = await lucia.createSession(userId, {
				created_at: new Date(),
				updated_at: new Date()
			});
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/app/profile'
			}
		});
	} catch (error) {
		console.error('Error exchanging code for token', error);

		if (error instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400,
				statusText: 'Bad Request'
			});
		}

		return new Response(null, {
			status: 500,
			statusText: 'Internal Server Error'
		});
	}
};

interface GitHubUser {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
	name: string;
	company: string;
	blog: string;
	location: string;
	email: string;
	hireable: boolean;
	bio: string;
	twitter_username: string;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
	private_gists: number;
	total_private_repos: number;
	owned_private_repos: number;
	disk_usage: number;
	collaborators: number;
	two_factor_authentication: boolean;
	plan: {
		name: string;
		space: number;
		private_repos: number;
		collaborators: number;
	};
}

interface GitHubUserEmail {
	email: string;
	verified: boolean;
	primary: boolean;
	visibility: 'public' | 'private';
}
