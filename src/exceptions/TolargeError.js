const ClientError = require("../exceptions/ClientError");

class PayloadTooLargeError extends ClientError {
    constructor(message = "Payload content length greater than maximum allowed: 1000000") {
        super(message, 413);
        this.name = "PayloadTooLargeError";
    }
}

module.exports = PayloadTooLargeError;
