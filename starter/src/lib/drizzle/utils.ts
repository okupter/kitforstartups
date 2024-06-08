const enableLogger = (logger: string | undefined) => {
	if (!logger) return false;
	return logger === 'true';
};

export { enableLogger };
