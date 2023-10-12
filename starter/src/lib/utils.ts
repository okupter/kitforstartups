import { Octokit } from 'octokit';

type FeedbackType = 'success' | 'error' | 'warning' | 'info';
type Feedback = {
	type: FeedbackType;
	path?: string;
	title: string;
	message: string;
};

const getFeedbackObjects = (feedbacks: Feedback[]): Feedback[] => {
	return feedbacks.map((feedback) => {
		return {
			type: feedback.type,
			path: feedback.path,
			title: feedback.title,
			message: feedback.message
		};
	});
};

const getFeedbackObjectByPath = (
	feedbacks: Feedback[] | undefined,
	path: string
): Feedback | undefined => {
	return feedbacks?.find((feedback) => {
		return feedback.path === path;
	});
};

const getGitHubPrimaryEmailAddress = async (accessToken: string) => {
	try {
		const octokit = new Octokit({
			auth: accessToken
		});

		const emails = await octokit.request('GET /user/emails', {
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			}
		});

		const primary = emails.data.find((email) => email.primary)?.email;

		return primary;
	} catch (error) {
		console.error(error);
	}
};

export { getFeedbackObjectByPath, getFeedbackObjects, getGitHubPrimaryEmailAddress, type Feedback };
