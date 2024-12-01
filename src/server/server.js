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

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;

        
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

        
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.output.payload.message, 
            });
            newResponse.code(response.output.statusCode); 
            return newResponse;
        }
        
        return h.continue;
    });

    await server.start();
    console.log(`Server started at: ${server.info.uri}`);
})();
