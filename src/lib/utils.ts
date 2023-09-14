type FeedbackType = 'success' | 'error' | 'warning' | 'info';

const getFeedbackObject = (feedback: { type: FeedbackType; title: string; message: string }) => {
	const { type, title, message } = feedback;

	return {
		feedback: {
			type,
			title,
			message
		}
	};
};

export { getFeedbackObject };
