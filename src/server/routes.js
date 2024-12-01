const { postPredictHandler , historiesHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/predict',
    handler: postPredictHandler,
    options: { payload: { maxBytes: 1000000, parse: true ,allow: 'multipart/form-data',multipart: true} }
  },
  {
    method: 'GET',
    path: '/predict/histories',
    handler: historiesHandler,
  },
];

module.exports = routes;
