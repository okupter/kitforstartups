interface DatabaseUserAttributes {
	email: string;
	email_verified: boolean;
	github_username?: string;
}

interface DatabaseSessionAttributes {
	created_at: Date;
	updated_at: Date;
}

const adapterOptions = {
	user: 'auth_user',
	session: 'user_session'
};

const generateUserAttributes = (data: DatabaseUserAttributes) => {
	return {
		email: data.email,
		emailVerified: data.email_verified,
		githubUsername: data.github_username
	};
};

const generateSessionAttributes = (data: DatabaseSessionAttributes) => {
	return {
		createdAt: data.created_at,
		updatedAt: data.updated_at
	};
};

export {
	adapterOptions,
	generateSessionAttributes,
	generateUserAttributes,
	type DatabaseSessionAttributes,
	type DatabaseUserAttributes
};
