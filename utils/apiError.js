exports.APIError = class APIError extends Error {
    constructor({ message, errors, status = 500 }) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.errors = errors;
        this.status = status;
    }
};
