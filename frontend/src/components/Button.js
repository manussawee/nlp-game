import styled from 'styled-components';

const Button = styled.button`
  height: 30px;
  background-color: #ce375c;
  color: white;
  border: 0;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  cursor: pointer;
  
  :hover {
    background-color: #b02040;
  }
  :active {
    background-color: #ce375c;
  }
`;

export default Button;