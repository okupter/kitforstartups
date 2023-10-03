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

export { getFeedbackObjectByPath, getFeedbackObjects, type Feedback };
