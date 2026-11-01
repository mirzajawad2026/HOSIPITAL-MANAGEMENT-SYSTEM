export const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
export const errorHandler = (err, req, res, next) => {
  const bad = ['ValidationError', 'CastError'].includes(err.name);
  res.status(bad ? 400 : err.status || 500).json({ message: err.message || 'Server error' });
};
