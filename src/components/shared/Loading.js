import React, { useContext } from 'react';
import styled from 'styled-components';

//import './Loading.scss';
import IconProcessing from './IconProcessing';
import { ThemeContext } from '../../contexts/Store';

const LoadingDiv = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top:0;
  left:0;

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

`

const Loading = () => {
  const [themeVariables] = useContext(ThemeContext);
  console.log('themeVariable', themeVariables)
  const ThemedLoadingDiv = styled(LoadingDiv)`
  background: ${themeVariables && themeVariables.appLight};
  svg {
    stroke: ${themeVariables && themeVariables.primary}
  }
  `

  return (
    <ThemedLoadingDiv>
      <IconProcessing />
    </ThemedLoadingDiv>
  )
}

export default Loading;
