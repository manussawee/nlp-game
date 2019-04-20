const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  socketPort: process.env.SOCKET_PORT || 4001,
  nlpAPI: process.env.NLP_API || 'http://35.198.212.186',
};

module.exports = config;
