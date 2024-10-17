// Global error handling middleware
// Global error handler middleware
exports.errorHandler = (err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: err.message });
};
