import React, { useContext, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { CurrentUserContext } from '../../contexts/Store';
import useInterval from '../../utils/PollingUtil';

const DepositFormInitial = () => {
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

  return (
    <>
      {copied && (
        <div className="Flash">
          <p>Copied!</p>
        </div>
      )}
      <h3><span role="img" aria-label="lightning bolt">⚡</span> Account almost ready <span role="img" aria-label="lightning bolt">⚡</span></h3>
      <h2>Step 1 of 2: Deposit</h2>
      <p>
        Send 0.05 ETH to your new account address. This will be enough to deploy your account and leave some for ongoing participation.
      </p>        
      <p className="Data AccountAddr">
        <span className="Label">Account Address</span>
        {currentUser.attributes['custom:account_address']}
      </p>
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
    </>
  );
};

export default DepositFormInitial;
