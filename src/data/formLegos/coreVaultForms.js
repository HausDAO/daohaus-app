import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { VAULT_TRANSFER_TX } from '../txLegos/transferContractTX';

export const CORE_VAULT_FORMS = {
  MINION_SEND_NETWORK_TOKEN: {
    title: 'Network Token Transfer',
    description: 'Make a proposal to transfer tokens out of the minion',
    type: PROPOSAL_TYPES.MINION_NATIVE,
    required: ['minionPayment', 'applicant', 'description'],
    minionType: MINION_TYPES.VANILLA,
    tx: VAULT_TRANSFER_TX.MINION_SEND_NETWORK_TOKEN,
    fields: [[FIELD.MINION_PAYMENT, FIELD.APPLICANT, FIELD.DESCRIPTION]],
  },
  MINION_SEND_ERC20_TOKEN: {
    title: 'ERC20 Token Transfer',
    description: 'Make a proposal to transfer tokens out of the minion',
    type: PROPOSAL_TYPES.MINION_ERC20,
    required: ['minionPayment', 'applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: VAULT_TRANSFER_TX.MINION_SEND_ERC20_TOKEN,
    fields: [[FIELD.MINION_PAYMENT, FIELD.APPLICANT, FIELD.DESCRIPTION]],
  },
  MINION_SEND_ERC721_TOKEN: {
    title: 'ERC721 Token Transfer',
    description: 'Make a proposal to transfer the nft out of the minion',
    type: PROPOSAL_TYPES.MINION_ERC721,
    required: ['applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: VAULT_TRANSFER_TX.MINION_SEND_ERC721_TOKEN,
    fields: [
      [
        { ...FIELD.NFT_SELECT, source: 'vault' },
        FIELD.MINION_SELECT,
        FIELD.APPLICANT,
        FIELD.DESCRIPTION,
      ],
    ],
  },
  MINION_SEND_ERC1155_TOKEN: {
    title: 'ERC1155 Token Transfer',
    description: 'Make a proposal to transfer the nft out of the minion',
    type: PROPOSAL_TYPES.MINION_ERC1155,
    required: ['applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: VAULT_TRANSFER_TX.MINION_SEND_ERC1155_TOKEN,
    fields: [
      [
        { ...FIELD.NFT_SELECT, source: 'vault' },
        FIELD.MINION_SELECT,
        FIELD.APPLICANT,
        FIELD.DESCRIPTION,
      ],
    ],
  },
};
