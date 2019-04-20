const moment = require('moment');
const dotenv = require('dotenv');
const socket = require('socket.io');

const session = require('./session');
const config = require('./config');

io = socket();
io.on('connection', (socket) => {
  console.log('an user connected');
  socket.on('typing', (data) => {
    const userID = session.get(data.access_token);
    const gameID = data.game_id;
    const passIndex = data.pass_index;
    const ok = data.ok;
    setPlayerPassIndex(gameID, userID, passIndex, ok);
  });
});

io.listen(config.socketPort);

const nlp = require('./nlp');
const { randomString } = require('./utils');

dotenv.config();

const WORD_NUM = process.env.WORD_NUM || 3;
const engine = {
  users: {},
  games: {},
};

const emitGame = (gameID) => {
  const game = getGame(gameID);
  if (game) {
    const users = {};
    if (game.players[0]) users[game.players[0].userID] = getUser(game.players[0].userID);
    if (game.players[1]) users[game.players[1].userID] = getUser(game.players[1].userID);
    io.emit(gameID, { game, users });
  }
};

const getPlayerIndex = (gameID, userID) => {
  let idx = -1;
  const game = engine.games[gameID];
  if (game) {
    game.players.forEach((p, index) => {
      if (p.userID === userID) idx = index;
    });
  }
  return idx;
};

const setGameState = async (gameID, state) => {
  const game = engine.games[gameID];
  if (game) {
    game.state = state;
    if (state === 'PLAY') game.startedAt = moment().toISOString();
    else if (state === 'FINISH') game.finishedAt = moment().toISOString();
    else if (state === 'READY') {
      let firstIndex = Math.floor(Math.random() * WORD_NUM);
      let secondIndex = Math.floor(Math.random() * WORD_NUM);
      while (
        game.players[0].words[firstIndex].indexOf(game.players[1].words[secondIndex]) >= 0
        || game.players[1].words[firstIndex].indexOf(game.players[0].words[secondIndex]) >= 0
      ) {
        firstIndex = Math.floor(Math.random() * WORD_NUM);
        secondIndex = Math.floor(Math.random() * WORD_NUM);
      }
      game.readiedAt = moment().toISOString();
      const rndIndex = Math.random() * 2 > 1 ? 0 : 1;
      const words = await nlp.getParagraph(game.players[rndIndex].words[firstIndex], game.players[rndIndex === 1 ? 0 : 1].words[secondIndex]);
      let isFirst = false, isSecond = false;
      game.paragraph = words.map(word => {
        let bonus = -1;
        if (!isFirst && game.players[0].words[firstIndex] === word) {
          bonus = 0;
          isFirst = true;
        }
        else if (!isSecond && game.players[1].words[secondIndex] === word) {
          bonus = 1;
          isSecond = true;
        }
        return {
          word,
          bonus,
        };
      });
      setGameState(gameID, 'PLAY');
    }
    emitGame(gameID);
  }
};

const addPlayer = (gameID, userID) => {
  const user = engine.users[userID];
  const game = engine.games[gameID];
  if (user && game && game.players.length < 2) {
    if (game.players.length === 0 || game.players[0].userID !== userID) {
      game.players.push({
        userID,
        words: [],
        passIndex: 0,
        bonus: {
          self: 0,
          enemy: 0,
        },
        ready: false,
      });
      emitGame(gameID);
      return 'OK';
    }
    return 'ERROR';
  } else return 'ERROR';
};

const createGame = (private = false) => {
  const gameID = `g+${randomString()}`;
  engine.games[gameID] = {
    id: gameID,
    players: [],
    state: 'SETUP',
    paragraph: [],
    private,
  };
  return gameID;
};

const createUser = (name, hero) => {
  const userID = `u+${randomString()}`;
  engine.users[userID] = { id: userID, name, hero };
  return userID;
};

const getUser = (userID) => {
  return engine.users[userID];
};

const editUser = (userID, name, hero) => {
  if (engine.users[userID]) {
    engine.users[userID] = { id: userID, name, hero };
    return 'OK';
  }
  return 'ERROR';
};

const getGame = (gameID) => {
  return engine.games[gameID];
};

const removePlayer = (gameID, userID) => {
  const game = engine.games[gameID];
  if (game && (game.state === 'SETUP' || game.state === 'END')) {
    game.players = game.players.filter(p => p.userID !== userID);
    if (game.players.length === 0) {
      delete engine.games[gameID];
    } else {
      emitGame(gameID);
    }
    return 'OK';
  }
  return 'ERROR';
};

const setPlayerReady = (gameID, userID, ready) => {
  const game = engine.games[gameID];
  const idx = getPlayerIndex(gameID, userID);
  if (game && game.state === 'SETUP') {
    if (idx !== -1) {
      if ((ready && game.players[idx].words.length === WORD_NUM) || !ready) {
        game.players[idx].ready = ready;
      }
      if (
        game.players.length === 2
        && game.players[0].ready
        && game.players[1].ready
      ) {
        setGameState(gameID, 'READY');
      }
      emitGame(gameID);
      return 'OK';
    }
  }
  return 'ERROR';
};

const setPlayerWords = (gameID, userID, words = []) => {
  const game = engine.games[gameID];
  const idx = getPlayerIndex(gameID, userID);
  if (game && game.state === 'SETUP') {
    if (idx !== -1 && words.length <= WORD_NUM && !game.players[idx].ready) {
      game.players[idx].words = words;
      emitGame(gameID);
      return 'OK';
    }
  }
  return 'ERROR';
};

const setPlayerPassIndex = (gameID, userID, passIndex, ok = true) => {
  const game = engine.games[gameID];
  const idx = getPlayerIndex(gameID, userID);
  if (game && game.state === 'PLAY') {
    if (idx !== -1) {
      game.players[idx].passIndex = passIndex;
      if (game.paragraph[passIndex - 1].bonus === idx && ok) {
        game.players[idx].bonus.self++;
      } else if (game.paragraph[passIndex - 1].bonus === (!idx ? 1 : 0) && ok) {
        game.players[idx].bonus.enemy++;
      }
      if (passIndex === game.paragraph.length) {
        game.players[idx].finishedAt = moment().toISOString();
        if (game.players[!idx ? 1 : 0].finishedAt) {
          setGameState(gameID, 'END');
        }
      }
      emitGame(gameID);
      return 'OK';
    }
  }
  return 'ERROR';
};

const addPlayerToQueue = (userID) => {
  const game = Object.values(engine.games).find(g => !g.private && g.players.length === 1);
  let gameID = '';
  if (game) {
    gameID = game.id;
  } else {
    gameID = createGame();
  }
  addPlayer(gameID, userID);
  emitGame(gameID);
  return gameID;
};

module.exports = {
  engine,
  createUser,
  getUser,
  editUser,
  createGame,
  getGame,
  addPlayer,
  removePlayer,
  setPlayerReady,
  setPlayerWords,
  setPlayerPassIndex,
  addPlayerToQueue,
};
