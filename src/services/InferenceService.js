const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

       
        const prediction = model.predict(tensor);

     
        const score = await prediction.data();

        
        console.log("Prediction score:", score);

        if (!score || score.length !== 1) {
            throw new Error("Model tidak memberikan output yang valid. Output harus berupa array dengan 1 nilai.");
        }

        
        const confidenceScore = score[0] * 100; 
        const label = score[0] > 0.5 ? 'Cancer' : 'Non-cancer';

        
        const suggestion = label === 'Cancer' 
            ? "Segera periksa ke dokter!" 
            : "Penyakit kanker tidak terdeteksi.";

       
        return { confidenceScore, label, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan dalam melakukan prediksi`);
    }
}

module.exports = predictClassification;
