import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET,
	GOOGLE_OAUTH_REDIRECT_URI
} from '$env/static/private';
import type { UserSchema } from 'lucia';

const adapterOptions = {
	user: 'auth_user',
	key: 'user_key',
	session: 'user_session'
};

const generateUserAttributes = (data: UserSchema) => {
	return {
		email: data.email,
		emailVerified: data.email_verified,
		githubUsername: data.github_username
	};
};

const googleAuthOptions = {
	clientId: GOOGLE_OAUTH_CLIENT_ID,
	clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
	redirectUri: GOOGLE_OAUTH_REDIRECT_URI,
	scope: [
		'openid',
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	],
	accessType: 'offline' as 'offline' | 'online' | undefined
};

const githubAuthOptions = {
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET,
	scope: ['user:email']
};

export { adapterOptions, generateUserAttributes, githubAuthOptions, googleAuthOptions };
