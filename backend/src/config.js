const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  socketPort: process.env.SOCKET_PORT || 4001,
};

module.exports = config;
