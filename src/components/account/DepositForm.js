import React, { useContext, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { CurrentUserContext } from '../../contexts/Store';
import { useInterval } from '../../utils/PollingUtil';

import { FlashDiv } from '../../variables.styles';

const DepositForm = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [delay, setDelay] = useState(null);
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    setDelay(2500);
    setCopied(true);
  };

  useInterval(() => {
    setCopied(false);
    setDelay(null);
  }, delay);
  const addrStyle = {
    marginTop: '20px',
    border: '2px solid #efefef',
    padding: '15px 25px',
    borderRadius: '50px',
  };
  return (
    <React.Fragment>
      {copied && (
        <FlashDiv>
          <p>Copied!</p>
        </FlashDiv>
      )}
      <h2>Send funds to your account address</h2>
      <p>You need Eth in your account to run transactions.</p>
      <p>
        <svg
          viewBox="0 0 256 417"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid"
          style={{ width: '36px' }}
        >
          <g>
            <polygon
              fill="#343434"
              points="127.9611 0 125.1661 9.5 125.1661 285.168 127.9611 287.958 255.9231 212.32"
            />
            <polygon
              fill="#8C8C8C"
              points="127.962 0 0 212.32 127.962 287.959 127.962 154.158"
            />
            <polygon
              fill="#3C3C3B"
              points="127.9611 312.1866 126.3861 314.1066 126.3861 412.3056 127.9611 416.9066 255.9991 236.5866"
            />
            <polygon
              fill="#8C8C8C"
              points="127.962 416.9052 127.962 312.1852 0 236.5852"
            />
            <polygon
              fill="#141414"
              points="127.9611 287.9577 255.9211 212.3207 127.9611 154.1587"
            />
            <polygon
              fill="#393939"
              points="0.0009 212.3208 127.9609 287.9578 127.9609 154.1588"
            />
          </g>
        </svg>
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path
          fill="white"
          d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
        />
      </svg>
      <p className="Data" style={addrStyle}>
        {currentUser.attributes['custom:account_address']}
      </p>{' '}
      <CopyToClipboard
        onCopy={onCopy}
        text={currentUser.attributes['custom:account_address']}
      >
        <button className="Address">
          Copy Address
          <svg
            className="IconRight"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="none" d="M0 0h24v24H0V0z" />
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z" />
          </svg>
        </button>
      </CopyToClipboard>
    </React.Fragment>
  );
};

export default DepositForm;
