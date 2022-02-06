import { buildMultiTxAction } from '../../utils/legos';
import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { CONTRACTS } from '../contracts';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

const swapTX = buildMultiTxAction({
  actions: [
    {
      targetContract: '.values.tokenAddress',
      abi: CONTRACTS.ERC_20,
      fnName: 'approve',
      args: ['.contextData.chainConfig.swapr.staking', '.values.amount'],
    },
    {
      targetContract: '.contextData.chainConfig.swapr.staking',
      abi: CONTRACTS.SWAPR_STAKING,
      logTX: true,
      fnName: 'stake',
      args: ['.values.amount'],
    },
  ],
});

export const SWAPR_BOOST_FORMS = {
  SWAPR_STAKE: {
    id: 'SWAPR_STAKE',
    dev: true,
    title: 'Swapr Staking Proposal',
    description: 'Stake Minion Funds into a Swapr farm.',
    type: PROPOSAL_TYPES.SWAPR_STAKING,
    // tx: TX.SUBMIT_PROPOSAL,
    // minionType: MINION_TYPES.SAFE,
    tx: swapTX,
    required: ['stakingAddress', 'tokenAddress', 'amount'],
    fields: [
      [
        FIELD.TITLE,
        FIELD.MINION_SELECT,
        {
          type: 'input',
          label: 'Staking Address',
          name: 'stakingAddress',
          htmlFor: 'title',
          placeholder: '0x',
          expectType: 'address',
        },
        {
          type: 'input',
          label: 'Staking Token Address',
          name: 'tokenAddress',
          htmlFor: 'title',
          placeholder: '0x',
          expectType: 'address',
        },
        {
          type: 'input',
          label: 'Amount',
          name: 'amount',
          htmlFor: 'amount',
          placeholder: 'in wei',
          expectType: 'integer',
        },
        FIELD.DESCRIPTION,
      ],
    ],
    additionalOptions: [FIELD.LINK],
  },
};
