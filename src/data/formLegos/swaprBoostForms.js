import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const SWAPR_BOOST_FORMS = {
  SWAPR_STAKE: {
    id: 'SWAPR_STAKE',
    logValues: true,
    title: 'Swapr Staking Proposal',
    description: 'Stake Minion Funds into a Swapr farm.',
    type: PROPOSAL_TYPES.SWAPR_STAKING,
    minionType: MINION_TYPES.SAFE,
    tx: TX.SWAPR_STAKE,
    required: [
      'title',
      'minionSelect',
      'stakingAddress',
      'amount',
      'stakingTokenAddress',
    ],
    fields: [
      [FIELD.TITLE, FIELD.MINION_SELECT, FIELD.TUTORIAL, FIELD.TUTORIAL2],
    ],
    additionalOptions: [FIELD.LINK, FIELD.DESCRIPTION],
  },
};
