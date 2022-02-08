import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const SWAPR_BOOST_FORMS = {
  SWAPR_STAKE: {
    id: 'SWAPR_STAKE',
    dev: true,
    title: 'Swapr Staking Proposal',
    description: 'Stake Minion Funds into a Swapr farm.',
    type: PROPOSAL_TYPES.SWAPR_STAKING,
    minionType: MINION_TYPES.SAFE,
    tx: TX.SWAPR_STAKE,
    required: ['stakingAddress', 'amount', 'stakingTokenAddress'],
    fields: [
      [
        FIELD.TITLE,
        FIELD.MINION_SELECT,
        {
          type: 'input',
          label: 'Staking Address',
          name: 'stakingAddress',
          htmlFor: 'stakingAddress',
          placeholder: '0x',
          expectType: 'address',
        },
        {
          type: 'input',
          label: 'Staking Token Address',
          name: 'stakingTokenAddress',
          htmlFor: 'stakingTokenAddress',
          placeholder: '0x',
          expectType: 'address',
        },
        {
          type: 'input',
          label: 'Amount',
          name: 'amount',
          htmlFor: 'amount',
          placeholder: 'Uint256',
          expectType: 'integer',
        },
      ],
    ],
    additionalOptions: [FIELD.LINK, FIELD.DESCRIPTION],
  },
};
