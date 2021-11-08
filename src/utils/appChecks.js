const appCheckFns = Object.freeze({
  isConnected({ address }) {
    return address
      ? true
      : 'Not connected to DAOhaus.app. Please check your provider.';
  },
  isSameChain({ injectedChain, daochain }) {
    return injectedChain?.chainId === daochain
      ? true
      : 'Not connected to the same network as the DAO. Please switch to teh DAOs network.';
  },
  isMember({ isMember }) {
    return isMember ? true : 'For shareholding members only';
  },
});

export const handleChecklist = (data, checklist = [], errorDeliveryType) => {
  const errorMsgs = checklist.reduce((array, check) => {
    const checkResult = appCheckFns[check](data);
    if (typeof checkResult === 'string') {
      return [...array, checkResult];
    }
    return array;
  }, []);
  if (!errorMsgs?.length) {
    return true;
  }
  if (errorDeliveryType === 'firstString') {
    return errorMsgs[0];
  }
  if (errorDeliveryType === 'softErrors') {
    return errorMsgs.map(error => ({ type: 'Value Check', message: error }));
  }
  if (errorDeliveryType === 'arrayOfStrings') {
    return errorMsgs;
  }
  return errorMsgs;
};
