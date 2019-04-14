import React, { useState } from 'react';
import styled from 'styled-components';

import Selector from './Selector';
import api from '../utils/api';

const heroOptions = [
  { label: 'ชัชชาติ', value: 'chatchart' },
  { label: 'ธนาธร', value: 'thanathorn' },
  { label: 'ประยุทธ์', value: 'prayut' },
  { label: 'ไพบูลย์', value: 'paiboon' },
  { label: 'สุดารัตน์', value: 'sudarat' },
  { label: 'อภิสิทธิ์', value: 'abhisit' },
];

const Container = styled.div`
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

const Bold = styled.div`
  font-weight: bold;
`;

const Row = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Col = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  padding-top: 16px;
  flex-direction: column;
  justify-content: center;
  :first-child {
    padding-right: 16px;
  }
  :last-child {
    padding-left: 16px;
  }
`;

const BigButton = styled.div`
  width: 100%;
  height: 64px;
  background-color: #ce375c;
  margin-bottom: 16px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  color: white;
  cursor: pointer;
  :hover {
    background-color: #b02040;
  }
  :active {
    background-color: #ce375c;
  }
`;

const GameSetup = ({
  user,
  setUser,
  history,
}) => {
  const [hero, setHero] = useState('chatchart');
  const createMatch = async () => {
    const { data } = await api.post('/game/create');
    history.push(`/${data.game_id}`);
  };
  const autoJoin = async () => {
    const { data } = await api.post('/game/auto-join');
    history.push(`/${data.game_id}`);
  };
  const editUser = (h) => {
    setHero(h);
    api.post('/user/edit', {
      name: user.name,
      hero: h,
    });
  }
  return (
    <Container>
      <div>
        <Bold>{user.name}</Bold>
        <div>เลือกฮีโร่: <Selector options={heroOptions} value={hero} onChange={editUser} /></div>
      </div>
      <Row>
        <Col>{hero}</Col>
        <Col>
          <BigButton onClick={createMatch}>สร้างห้องแข่ง</BigButton>
          <BigButton onClick={autoJoin}>หาห้องแข่ง</BigButton>
        </Col>
      </Row>
    </Container>
  );
};

export default GameSetup;
