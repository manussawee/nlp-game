import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Button from '../components/Button';
import Input from '../components/Input';
import SetupScreen from '../components/SetupScreen';
import api from '../utils/api';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  width: 360px;
  background-color: #f0f1f2;
  box-shadow: 4px 4px 12px 2px rgba(0,0,0,0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
`;

const Header = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Row = styled.div`
  margin-bottom: 8px;
  :last-child {
    margin-bottom: 0;
  }
`;

const Home = (props) => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const addUser = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/user/add', { name: username, hero: 'chatchart' });
    api.setAccessToken(data.access_token);
    getUser();
  };
  const getUser = async () => {
    const { data } = await api.get('/user/me');
    setUser(data.user);
  };
  useEffect(() => {
    getUser();
  }, [api.getAccessToken()]);
  return (
    <Container>
      {!user && (
        <Form onSubmit={addUser}>
          <Header>NLP GAME</Header>
          <Row><Input autoFocus placeholder="Player Name" value={username} onChange={e => setUsername(e.target.value)} /></Row>
          <Row><Button>Start!</Button></Row>
        </Form>
      )}
      {user && (
        <SetupScreen user={user} setUser={setUser} history={props.history} />
      )}
    </Container>
  );
};

export default Home;
