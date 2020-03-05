import React, { useState } from 'react';
import styled from 'styled-components';
import { primaryHover, primary } from '../../variables.styles';

const ExpandableButton = styled.button`
    background-color: transparent;
    color: ${primary};
    padding: 0px;
    margin: 38px 0px;
    &:hover {
    background-color: transparent;
    color: ${primaryHover};
`;

const Expandable = ({ children, label }) => {
  const [isShowing, setIsShowing] = useState(false);

  return isShowing ? (
    <div>{children}</div>
  ) : (
    <ExpandableButton onClick={() => setIsShowing(!isShowing)}>
      + {label || ''}
    </ExpandableButton>
  );
};
export default Expandable;
