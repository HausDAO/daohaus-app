import React from 'react';
import IconProcessing from './IconProcessing';
import styled from 'styled-components';
import { getAppLight } from '../../variables.styles';

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${(props) => getAppLight(props.theme)};
  display: block;
  z-index: 10;
  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
  }
`;

const Loading = () => {
  return (
    <LoadingContainer>
      <IconProcessing />
    </LoadingContainer>
  );
};

export default Loading;
