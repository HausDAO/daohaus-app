import { isDelegating } from './general';

const appCheckFns = Object.freeze({
  isConnected({ address }) {
    return address
      ? true
      : 'Not connected to DAOhaus.app. Please check your wallet provider.';
  },
  isSameChain({ injectedChain, daochain }) {
    return injectedChain?.chainId === daochain
      ? true
      : 'Your wallet is not connected to same network as the DAO.';
  },
  isMember({ isMember }) {
    return isMember ? true : 'For shareholding members only';
  },
  canSponsorAndVote({ daoMember, delegate }) {
    if (Number(daoMember?.shares) > 0 && !isDelegating(daoMember)) {
      return true;
    }
    if (delegate) {
      return true;
    }
    return 'For shareholding members only';
  },
  spamFilterMemberOnlyOff({ daoMetaData, isMember }) {
    const hasSpamFilterMemberOnly =
      daoMetaData?.boosts?.SPAM_FILTER?.active &&
      daoMetaData?.boosts?.SPAM_FILTER?.metadata?.membersOnly &&
      isMember;

    return !hasSpamFilterMemberOnly ? true : 'For shareholding members only';
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
