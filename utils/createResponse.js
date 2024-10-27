exports.createResponse = (success, message, statusCode, error = null, data = null) => {
  return success === false
    ? { success, message, statusCode, error }
    : { success, message, statusCode, data };
};
