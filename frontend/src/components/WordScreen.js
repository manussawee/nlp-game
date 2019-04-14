import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import api from '../utils/api';
import Input from './Input';
import Button from './Button';

const PaddingRight = styled.span`
  padding-right: 8px;
`;

const Content = styled.div`
  width: 800px;
  height: 600px;
  position: relative;
  background-color: #f0f1f2;
  box-shadow: 4px 4px 12px 2px rgba(0,0,0,0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 32px;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Col = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
  align-items: center;
`;

const ReadyButton = styled(Button)`
  font-weight: bold;
  font-size: 48px;
  height: auto;
  padding: 12px 32px;
  ${props => props.disabled && 'cursor: initial;'}
  ${props => props.disabled && 'background-color: grey;'}
  :hover {
    ${props => props.disabled && 'background-color: grey;'}
  }
  :active {
    ${props => props.disabled && 'background-color: grey;'}
  }
`;

const ReadyText = styled.div`
  color: green;
  font-weight: bold;
  font-size: 48px;
  height: 56px;
`;

const ButtonBlock = styled.div`
  height: 80px;
`;

const CenterBold = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 16px;
`;

const RowBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WordScreen = ({
  gameID,
  user,
  game,
  users,
}) => {
  const [word, setWord] = useState('');
  
  const myPlayer = (game && game.players && game.players.find(p => p.userID === user.id)) || {};
  const myWords = (myPlayer && myPlayer.words) || [];
  const enemyPlayer = (game && game.players && game.players.find(p => p.userID !== user.id)) || {};
  

  useEffect(() => {
    if (gameID && user && user.id && myPlayer && !myPlayer.userID) {
      api.post('/game/join', {
        game_id: gameID,
      });
    }
  }, [gameID, user && user.id]);
  const setReady = (ready) => {
    api.post('/game/set-ready', {
      game_id: gameID,
      ready,
    });
  };
  const addWord = (e) => {
    e.preventDefault();
    if (word.length > 0 && myWords.length < 3 && !myWords.find(w => w === word)) {
      api.post('/game/set-words', {
        game_id: gameID,
        words: [...myWords, word],
      });
      setWord('');
    }
  };
  const reset = (e) => {
    e.preventDefault();
    api.post('/game/set-words', {
      game_id: gameID,
      words: [],
    });
  };
  const leave = async () => {
    if (game.state === 'SETUP') {
      await api.post('/game/leave', { game_id: gameID });
      window.location = '/';
    }
  }
  return (
    <Content>
      <RowBetween>
        <form onSubmit={addWord}>
          <span>คำของคุณ: <PaddingRight>{myWords.join(', ')}</PaddingRight></span>
          {game.state === 'SETUP' && <PaddingRight><Input autoFocus value={word} onChange={e => setWord(e.target.value)} /></PaddingRight>}
          {game.state === 'SETUP' && <PaddingRight><Button>เพิ่มคำ</Button></PaddingRight>}
          {game.state === 'SETUP' && <Button onClick={reset}>ยกเลิก</Button>}
        </form>
        {game.state === 'SETUP' && <Button onClick={leave}>ออกจากห้อง</Button>}
      </RowBetween>
      <Row>
        <Col>
          <div>
            <CenterBold>{users[myPlayer.userID] && users[myPlayer.userID].name}</CenterBold>
            <ReadyText>{myPlayer.ready && 'พร้อม'}</ReadyText>
          </div>
          <ReadyButton disabled={myWords.length < 3} onClick={() => myWords.length === 3 && setReady(!myPlayer.ready)}>{myPlayer.ready ? 'ยังไม่พร้อม' : 'พร้อมแล้ว'}</ReadyButton>
        </Col>
        <Col>
          <div>
            <CenterBold>{users[enemyPlayer.userID] && users[enemyPlayer.userID].name}</CenterBold>
            <ReadyText>{enemyPlayer.ready && 'พร้อม'}</ReadyText>
          </div>
          <ButtonBlock />
        </Col>
      </Row>
    </Content>
  );
};

export default WordScreen;
