import { BiErrorCircle } from 'react-icons/bi';

import { useDao } from '../contexts/DaoContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { CONTRACTS, TX } from '../data/contractTX';
import { getReadableBalance } from '../utils/tokenValue';

const useBoost = () => {
  const { daoMetaData } = useMetaData();
  const { daoOverview } = useDao();

  return {
    isActive(boostKey) {
      return daoMetaData?.boosts[boostKey]?.active;
    },
    // custom boost related functions
    spamFilterNotice(tx) {
      const proposalTypeNeedsTribute =
        tx.name !== TX.WHITELIST_TOKEN_PROPOSAL.name &&
        tx.name !== TX.GUILDKICK_PROPOSAL.name &&
        tx.contract.abiName === CONTRACTS.CURRENT_MOLOCH.abiName;
      if (proposalTypeNeedsTribute && daoMetaData.boosts?.SPAM_FILTER?.active) {
        const depositAmount = `${getReadableBalance({
          balance: daoMetaData.boosts.SPAM_FILTER.metadata.paymentRequested,
          decimals: daoOverview.depositToken.decimals,
        })}`;
        return {
          idle: {
            icon: BiErrorCircle,
            title: `Spam filtering is ON for this DAO, a non-refundable tribute of ${depositAmount} ${daoOverview.depositToken.symbol} is needed to ensure it isn't hidden from the main proposal view.`,
          },
        };
      }
      return null;
    },
  };
};

export default useBoost;
