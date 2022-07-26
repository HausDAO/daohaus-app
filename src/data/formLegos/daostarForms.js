import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const DAOSTAR_FORMS = {
  DAOSTAR_REGISTER: {
    id: 'DAOSTAR_REGISTER',
    dev: true,
    minionType: MINION_TYPES.SAFE,
    type: PROPOSAL_TYPES.DAOSTAR_REGISTER,
    title: 'Register with DAOStar',
    description: 'Register your DAO URI via the DAOStar registration factory',
    tx: TX.DAOSTAR_REGISTER,
    required: ['daoURI', 'selectedMinion'],
    fields: [
      [
        {
          type: 'input',
          label: 'DAO URI',
          name: 'daoURI',
          htmlFor: 'daoURI',
          placeholder: 'ipfs://...',
          expectType: 'any',
        },
        FIELD.MINION_SELECT,
      ],
    ],
  },
};
