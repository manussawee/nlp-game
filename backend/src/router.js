const user = require('./user');
const game = require('./game');
const { engine } = require('./engine');

const router = (app) => {
  app.get('/', (req, res) => {
    res.send(engine);
  });
  app.get('/user/me', user.me);
  app.post('/user/add', user.add);
  app.post('/user/edit', user.edit);
  app.post('/game/create', game.create);
  app.get('/game/get', game.get);
  app.post('/game/set-words', game.setWords);
  app.post('/game/set-ready', game.setReady);
  app.post('/game/join', game.join);
  app.post('/game/auto-join', game.autoJoin);
  app.post('/game/leave', game.leave);
};

module.exports = router;
