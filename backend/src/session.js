const { randomString } = require('./utils');

const sessionData = {};

const set = (userID) => {
  accessToken = randomString(32);
  sessionData[accessToken] = userID;
  return accessToken;
};

const get = (accessToken) => {
  return sessionData[accessToken];
};

const setup = () => (req, res, next) => {
  if (req.query.access_token) {
    req.userID = sessionData[req.query.access_token];
  }
  next();
};

module.exports = {
  setup,
  set,
  get,
};