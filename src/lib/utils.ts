import dayjs from 'dayjs';

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

const toProperCase = (str: string): string => {
	return str && str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

const formatDate = (date: any) => dayjs(Number(date)).format('MMMM D, YYYY');

const formatCurrency = (amount: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export { getFeedbackObjectByPath, getFeedbackObjects, type Feedback, toProperCase, formatDate, formatCurrency };
