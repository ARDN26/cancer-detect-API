require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const { LoadModel } = require('../services/LoadModel');
const InputError = require('../exceptions/InputError');
const PredictionError = require('../exceptions/predictionError');
const PayloadTooLargeError = require('../exceptions/TolargeError');

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    const model = await LoadModel();
    server.app.model = model;

    server.route(routes);

    // Middleware untuk menangani error
    server.ext('onPreResponse', function (request, h) {
        const response = request.response;

        // Tangani error dari jenis ClientError (InputError, PredictionError, PayloadTooLargeError)
        if (
            response instanceof InputError ||
            response instanceof PredictionError ||
            response instanceof PayloadTooLargeError
        ) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        // Tangani error lain (Boom error)
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.output.payload.message, // Mengambil pesan error
            });
            newResponse.code(response.output.statusCode); // Status kode dari Boom
            return newResponse;
        }
        // Jika tidak ada error, lanjutkan respons normal
        return h.continue;
    });

    await server.start();
    console.log(`Server started at: ${server.info.uri}`);
})();
