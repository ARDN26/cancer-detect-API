const tf = require('@tensorflow/tfjs-node');
 
async function LoadModel() {
    return tf.loadGraphModel(process.env.MODEL_URL);
}
 
module.exports = { LoadModel };