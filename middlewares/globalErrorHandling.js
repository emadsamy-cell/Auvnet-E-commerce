const { createResponse } = require("../utils/createResponse");

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
