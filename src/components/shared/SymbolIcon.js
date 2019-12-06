import React from 'react';

const SymbolIcon = ({ tokenSymbol }) => {
  switch (tokenSymbol) {
    case 'WETH': {
      return <span>Ξ</span>;
    }
    default: {
      return null;
    }
  }
};

export default SymbolIcon;
