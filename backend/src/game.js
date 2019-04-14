const session = require('./session');
const {
  createGame,
  addPlayer,
  getGame,
  getUser,
  setPlayerWords,
  setPlayerReady,
  removePlayer,
  addPlayerToQueue,
} = require('./engine');

module.exports = {
  create: (req, res) => {
    const gameID = createGame();
    const result = addPlayer(gameID, req.userID);
    res.send({ game_id: gameID, result });
  },
  get: (req, res) => {
    const game = getGame(req.query.game_id);
    if (game) {
      const users = {};
      if (game.players[0]) users[game.players[0].userID] = getUser(game.players[0].userID);
      if (game.players[1]) users[game.players[1].userID] = getUser(game.players[1].userID);
      res.send({ game, users });
    } else {
      res.send({ game, users: {} });
    }
  },
  setWords: (req, res) => {
    const result = setPlayerWords(
      req.body.game_id,
      req.userID,
      req.body.words
    );
    res.send({ result });
  },
  setReady: (req, res) => {
    const result = setPlayerReady(
      req.body.game_id,
      req.userID,
      req.body.ready
    );
    res.send({ result });
  },
  join: (req, res) => {
    const result = addPlayer(req.body.game_id, req.userID);
    res.send({ result });
  },
  autoJoin: (req, res) => {
    const gameID = addPlayerToQueue(req.userID);
    res.send({ game_id: gameID });
  },
  leave: (req, res) => {
    const result = removePlayer(req.body.game_id, req.userID);
    res.send({ result });
  },
};
