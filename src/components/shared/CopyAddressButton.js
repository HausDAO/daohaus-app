import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

// import { AddressButton } from './UserBalances.styles';
import { DataButton } from '../../App.styles';
import { useInterval } from '../../utils/PollingUtil';
import styled from 'styled-components';

export const AddressButton = styled(DataButton)`
  margin: 0;
  padding: 0px;
  border: none;
  background: transparent;
  color: black;
  width: auto;
  display: inline-block;
  &:hover {
    color: ${(props) => props.theme.tertiary};
    fill: ${(props) => props.theme.secondary};
  }
  p {
    color: black;
  }
  svg {
    display: inline-block;
    fill: black;
    width: 18px;
    height: 18px;
    margin-left: 5px;
  }
`;

const CopyAddressButton = ({ address }) => {
  const [copied, setCopied] = useState(false);
  const [delay, setDelay] = useState(null);

  const onCopy = () => {
    setDelay(2500);
    setCopied(true);
  };

  useInterval(() => {
    setCopied(false);
    setDelay(null);
  }, delay);

  return (
    <CopyToClipboard onCopy={onCopy} text={address}>
      <AddressButton>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z" />
        </svg>
        {copied && <p>Copied!</p>}
      </AddressButton>
    </CopyToClipboard>
  );
};

export default CopyAddressButton;
