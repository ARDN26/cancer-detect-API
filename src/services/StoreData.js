const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore();
async function storeData(id, data) {
  
  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

async function getPredictions() {
  const snapshot = await db.collection('predictions').get();
  return snapshot.docs.map(doc => ({ id: doc.id, history: doc.data() }));
}

module.exports = { storeData , getPredictions};
