import React from 'react';

const SymbolIcon = ({ tokenSymbol }) => {
  switch (tokenSymbol) {
    case 'WETH': {
      return <span>Ξ</span>;
    }
    case 'DAI': {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2500 2500">
          <title>dai</title>
          <path
            className="a"
            fill="#ffce45"
            d="M1250,287.71l941.84,941.84L1250,2171.4,308.16,1229.55Z"
          />
          <path
            className="b"
            fill="#febe44"
            d="M1250,1536.89,307.38,1229.51,1250,287.68l942.62,941.83Z"
          />
          <path
            className="c"
            fill="#fff"
            d="M635.25,1168h430.32L1250,963.11,1454.92,1168h430.33L1250,481.58Z"
          />
          <path
            className="d"
            fill="#d9a547"
            opacity="0.42"
            isolation="isolate"
            d="M1250,2171.34V287.68l941.83,941.83L1250,2171.34Z"
          />
        </svg>
      );
    }
    default: {
      return null;
    }
  }
};

export default SymbolIcon;
