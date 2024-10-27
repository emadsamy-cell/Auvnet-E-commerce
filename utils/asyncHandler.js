//This function to avoid writing try catch in its end point
exports.asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      if(error.code === 11000){
        // Duplicate key error (unique constraint violation)
        const field = Object.keys(error.keyPattern)[0];  
        return next(Error(`${field} already exists. Please choose a different one.`, { cause: 409 }));
      }
      return next(Error(error.message, { cause: error.cause }));
    }
  };
};
