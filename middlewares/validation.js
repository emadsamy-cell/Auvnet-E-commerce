const dataMethods = ['body', 'params', 'query', 'headers'];
const { createResponse } = require('../utils/createResponse');
const { asyncHandler } = require('../utils/asyncHandler');

exports.validation = schema => {
  return asyncHandler(async (req, res, next) => {
    const errList = [];
    await dataMethods.forEach(async(method) => {
      if (schema[method]) {
         const validationResult = await schema[method].validate(req[method], {
          abortEarly: false,
        });
        if (validationResult?.error) {
          errList.push(validationResult.error.details);
        }
      }
    });
    if (errList.length) {
      return res.status(400).json(createResponse(false, 'validation error', 400 , errList));
    } else {
      return next();
    }
  });
};

