exports.createResponse = (success, message, statusCode, data = null) => {
  return data === null
    ? { success, message, statusCode }
    : { success, message, statusCode, data };
};
