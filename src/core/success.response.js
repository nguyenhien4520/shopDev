const StatusCode = {
    OK: 200,
    CREATED: 201
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created',
}

class SuccessResponse {
    constructor({message, statusCode= StatusCode.OK, reasonStatusCode = ReasonStatusCode.CREATED, metadata = {}, options = {}}){
        this.message = message;
        this.status = statusCode;
        this.metadata = metadata
        this.options = options
    }

    send(res, headers = {}){
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}){
        super({message, metadata})
    }
}

class CREATED extends SuccessResponse {
    constructor({message, statusCode= StatusCode.CREATED, reasonStatusCode= ReasonStatusCode.CREATED, metadata, options}){
        super({message, statusCode, reasonStatusCode, metadata, options})
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessResponse
}