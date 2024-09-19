//This function to avoid writing try catch in its end point
exports.asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      return next(Error(error.message, { cause: error.cause }));
    }
  };
};
