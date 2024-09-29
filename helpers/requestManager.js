exports.filterRequestBody = (body, allowedFields) => {
    const filteredBody = {};
    Object.keys(body).forEach(el => {
        if (allowedFields.includes(el)) filteredBody[el] = body[el];
    });
    return filteredBody;
}