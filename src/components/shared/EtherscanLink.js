import React from 'react';
import config from '../../config';

const EtherscanLink = ({ type, hash, linkText }) => {
  const uri = () => {
    switch (config.CHAIN_ID) {
      case '1': {
        return `https://etherscan.io/${type}/`;
      }
      case '42': {
        return `https://kovan.etherscan.io/${type}/`;
      }
      case '4': {
        return `https://rinkeby.etherscan.io/${type}/`;
      }
      case '100': {
        return `https://blockscout.com/poa/xdai/${type}/`;
      }
      default: {
        return `https://etherscan.io/${type}/`;
      }
    }
  };

  return (
    <p className="EtherscanLink">
      <a href={`${uri()}${hash}`} target="_blank" rel="noopener noreferrer">
        {linkText}
      </a>
    </p>
  );
};

export default EtherscanLink;
