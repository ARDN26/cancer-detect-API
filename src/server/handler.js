const predictClassification = require('../services/InferenceService');
const crypto = require('crypto');
const {storeData , getPredictions} = require('../services/StoreData');
const InputError = require('../exceptions/InputError');
const PredictionError = require('../exceptions/predictionError');
const PayloadTooLargeError = require('../exceptions/TolargeError');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

       
        if (!image) {
            throw new InputError('Field image harus diisi');
        }

        
        if (Buffer.byteLength(image, 'utf8') > 1000000) {
            throw new PayloadTooLargeError();
        }

       
        const { label, suggestion } = await predictClassification(model, image);

        
        if (!label || !suggestion) {
            throw new PredictionError('Kesalahan dalam melakukan prediksi');
        }

        
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            suggestion,
            createdAt,
        };

        await storeData(id, data);

        
        const response = h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data,
        });
        response.code(201);
        return response;
    } catch (error) {
        if (error instanceof InputError || error instanceof PredictionError || error instanceof PayloadTooLargeError) {
           
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(error.statusCode);
            return response;
        }

        
        throw error;
    }
}

async function historiesHandler(request, h) {
    try {
        const histories = await getPredictions(); // Mengambil semua data dari storage

        if (!histories || histories.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Riwayat prediksi tidak ditemukan',
            }).code(404);
        }

        return h.response({
            status: 'success',
            data: histories,
        }).code(200);
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: 'Terjadi kesalahan saat mengambil riwayat prediksi',
        });
        response.code(500);
        return response;
    }
}


module.exports = { postPredictHandler , historiesHandler } ;
