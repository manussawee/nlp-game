import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';

import Home from './pages/Home';
import GamePage from './pages/Game';

const OuterContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  color: #2d2d2d;
  font-size: 14px;
`;

const App = () => {
  return (
    <OuterContainer>
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/:gameID" exact component={GamePage} />
      </Router>
    </OuterContainer>
  );
};

export default App;
