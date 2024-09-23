const { createResponse } = require("../utils/createResponse");
const path = require('path');

exports.globalErrorHandling = (err, req, res, next) => {
  if (err) {
    if (process.env.MODE === "DEV") {
      return res
        .status(err["cause"] || 500)
        .json(
          createResponse(false, err.message, err["cause"] || 500, err.stack)
        );
    } else {
      return res
        .status(err["cause"] || 500)
        .json(createResponse(false, err.message, err["cause"] || 500));
    }
  }
};

exports.notFound = (req, res, next) => {
  const isApiRequest = req.headers['user-agent'].includes('axios') || req.headers['user-agent'].includes('fetch') || req.headers['postman-token'] || req.headers['user-agent'].includes('insomnia');
  if (isApiRequest) {
    const err = new this.APIError({
      message: 'Route Not found',
      status: 404,
    });
    return this.handler(err, req, res);
  }
  else {
    return res.sendFile(path.join(__dirname, '..', 'public', 'notFound.html'));
  }
};

