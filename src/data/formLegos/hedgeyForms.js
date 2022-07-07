import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const HEDGEY_FORMS = {
  CONTRIBUTOR_REWARDS_BOOST: {
    id: 'CONTRIBUTOR_REWARDS_BOOST',
    title: 'Hedgey Contributor Rewards',
    description: 'Distribute contributor rewards as time-locked NFTs',
    type: PROPOSAL_TYPES.HEDGEY_CONTRIBUTOR_REWARDS,
    minionType: MINION_TYPES.SAFE,
    tx: TX.CONTRIBUTOR_REWARDS_TOKEN,
    required: ['selectedMinion', 'contributorRewardList', 'tokenAddress'],
    fields: [
      [FIELD.MINION_SELECT, FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK],
      [
        FIELD.MINION_TOKEN_SELECT,
        {
          type: 'dateSelect',
          label: 'Unlock Date',
          htmlFor: 'unlockDate',
          name: 'unlockDate',
          placeholderText: 'Reward Unlock Date',
        },
        {
          type: 'contributorRewardListInput',
          label: 'Recipients, Amounts, and optional Unlock Date Overrides',
          name: 'contributorRewardList',
          htmlFor: 'contributorRewardList',
          placeholder:
            '0x1234...5678 1.23 2023/01/01\n0x8765...4321,3.21\n0x5678...1234=3.21',
          expectType: 'contributorRewardList',
        },
      ],
    ],
  },
};
