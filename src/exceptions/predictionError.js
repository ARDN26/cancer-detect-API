const ClientError = require("../exceptions/ClientError");

class PredictionError extends ClientError {
    constructor(message = "Terjadi kesalahan dalam melakukan prediksi") {
        super(message, 400);
        this.name = "PredictionError";
    }
}

module.exports = PredictionError;
