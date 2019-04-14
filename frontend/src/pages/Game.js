import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';

import config from '../config';
import api from '../utils/api';
import PlayScreen from '../components/PlayScreen';
import withParams from '../utils/withParams';
import WordScreen from '../components/WordScreen';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Game = ({ params }) => {
  const [socket, setSocket] = useState({
    on: () => console.log('on'),
    emit: () => console.log('emit'),
  });
  const [game, setGame] = useState({});
  const [users, setUsers] = useState({});
  const [user, setUser] = useState({});
  const getUser = async () => {
    const { data } = await api.get('/user/me');
    if (data.user) {
      setUser(data.user);
    } else {
      window.location = '/';
    }
  };
  const getGame = async () => {
    const { data } = await api.get('/game/get', { game_id: params.gameID });
    if (data && data.game && data.users) {
      setGame(data.game);
      setUsers(data.users);
    }
  };
  useEffect(() => {
    getGame();
  }, [params.gameID]);
  useEffect(() => {
    getUser();
  }, [api.getAccessToken()]);
  useEffect(() => {
    setSocket(io(config.socket));
  }, []);
  useEffect(() => {
    socket.on(params.gameID, (data) => {
      setGame(data.game);
      setUsers(data.users);
    });
  }, [socket]);
  return (
    <Container>
      {game && (game.state !== 'PLAY' && game.state !== 'END') && (
        <WordScreen
          gameID={params.gameID}
          user={user}
          game={game}
          users={users}
        />
      )}
      {game && (game.state === 'PLAY' || game.state === 'END') && (
        <PlayScreen
          gameID={params.gameID}
          user={user}
          game={game}
          users={users}
          socket={socket}
        />
      )}
    </Container>
  );
};

export default withParams(Game);
