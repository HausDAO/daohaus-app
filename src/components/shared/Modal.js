import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { basePadding, getAppBackground } from '../../variables.styles';

const ModalDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 100vh;
  background-color: ${(props) => getAppBackground(props.theme)};
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 99;
`;

const ContentsDiv = styled.div`
  padding: ${basePadding};
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  input {
    max-width: 100%;
  }
  .Form {
    padding: 0px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 25px;
  right: 25px;
  background: none;
  margin: 0;
  padding: 0px;
  svg {
    fill: ${(props) => props.theme.baseFontColor};
    width: 36px;
    height: 36px;
  }
`;

const Modal = ({ isShowing, hide, children }) =>
  isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="ModalBackdrop" />
          <ModalDiv aria-modal aria-hidden tabIndex={-1} role="dialog">
            <CloseButton
              type="button"
              data-dismiss="modal"
              aria-label="Close"
              onClick={hide}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </CloseButton>
            <ContentsDiv>{children}</ContentsDiv>
          </ModalDiv>
        </React.Fragment>,
        document.body,
      )
    : null;

export default Modal;
