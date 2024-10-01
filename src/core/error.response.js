const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error',
}

const {StatusCodes, ReasonPhrases} = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
        constructor(message, status){
            super(message);
            this.status = status;
        }
}

class ConflicRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT){
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN){
        super(message, statusCode);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.AuthFailureError, statusCode = StatusCodes.AuthFailureError){
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NotFoundError, statusCode = StatusCodes.NOT_FOUND){
        super(message, statusCode);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN){
        super(message, statusCode);
    }
}

module.exports = {
    ConflicRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
}
