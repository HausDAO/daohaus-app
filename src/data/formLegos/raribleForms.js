import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const RARIBLE_FORMS = {
  SELL_NFT_RARIBLE: {
    id: 'SELL_NFT_RARIBLE',
    formConditions: ['unset', 'fixed'],
    title: 'Sell NFT on Rarible',
    description: 'Post an NFT for sale on Rarible',
    type: PROPOSAL_TYPES.SELL_NFT_RARIBLE,
    minionType: MINION_TYPES.SAFE,
    tx: TX.SELL_NFT_RARIBLE,
    required: ['selectedMinion', 'orderPrice', 'raribleNftData'],
    fields: [
      [FIELD.NFT_SELECT],
      [
        FIELD.DATE_RANGE_SWITCH,
        {
          type: 'formCondition',
          fixed: FIELD.DATE_RANGE,
          unset: null,
        },
        {
          ...FIELD.SET_PRICE,
          orderType: 'sell',
        },
        FIELD.RARIBLE_NFT_DATA,
      ],
    ],
  },
  BUY_NFT_RARIBLE: {
    id: 'BUY_NFT_RARIBLE',
    title: 'Buy an NFT on Rarible',
    description:
      'Make a proposal to bid on an NFT on Rarible using a Minion Safe Vault',
    type: PROPOSAL_TYPES.BUY_NFT_RARIBLE,
    minionType: MINION_TYPES.SAFE,
    tx: TX.BUY_NFT_RARIBLE,
    required: [
      'orderPrice',
      'raribleNftData',
      'selectedMinion',
      'targetNft',
      'title',
    ],
    fields: [
      [FIELD.NFT_URI],
      [
        FIELD.MINION_SELECT,
        {
          ...FIELD.DESCRIPTION,
          name: 'nftDescription',
          htmlFor: 'nftDescription',
        },
        {
          ...FIELD.SET_PRICE,
          orderType: 'buy',
        },
        FIELD.RARIBLE_NFT_DATA,
      ],
    ],
  },
};
