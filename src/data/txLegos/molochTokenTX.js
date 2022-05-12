import { CONTRACTS } from '../contracts';

export const MOLOCH_TOKEN_FACTORY_TX = {
  CREATE_MOLOCH_TOKEN: {
    contract: CONTRACTS.MOLOCH_TOKEN_FACTORY,
    name: 'summonMolochToken',
    poll: 'boostSubgraph',
    display: 'Create Moloch Token',
    errMsg: 'Error creating Moloch Token',
    successMsg: 'Moloch Token added!',
    gatherArgs: [
      '.contextData.daoid',
      '.values.token_name',
      '.values.token_symbol',
    ],
  },
};
