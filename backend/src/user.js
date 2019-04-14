const session = require('./session');
const { createUser, getUser, editUser } = require('./engine');

module.exports = {
  add: (req, res) => {
    const userID = createUser(req.body.name, req.body.hero);
    accessToken = session.set(userID);
    res.send({ access_token: accessToken });
  },
  me: (req, res) => {
    if (req.userID) {
      const user = getUser(req.userID);
      res.send({ user });
    } else res.send({ user: null });
  },
  edit: (req, res) => {
    if (req.userID) {
      const result = editUser(
        req.userID,
        req.body.name,
        req.body.hero
      );
      res.send({ result });
    } else res.send(null);
  },
};
