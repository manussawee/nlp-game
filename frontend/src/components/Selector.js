import React from 'react';
import styled from 'styled-components';

const Select = styled.select`
  border-radius: 8px;
  border: 0;
  height: 28px;
  padding-left: 8px;
  background-color: white;
  font-size: 14px;
  width: ${props => (props.width || 'auto')};
`;

const Selector = ({
  onChange,
  options,
  value,
  width,
}) => {
  return (
    <Select width={width} value={value} onChange={e => onChange(e.target.value)}>
      {options.map(({ value: v, label }) => (
        <option key={v} value={v}>{label}</option>
      ))}
    </Select>
  );
};

export default Selector;
